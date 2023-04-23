const axios = require("axios");

const createToken = async () => {
  const secret = "PTQt9FSSFKtwGJpk";
  const consumer = "r9JzOoSOysxAfwYWaq83GrbRNGRAjVGK";
  const auth = new Buffer.from(`${consumer}:${secret}`).toString("base64");
  try {
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          authorization: `Basic ${auth}`,
        },
      }
    );
    const token = response.data.access_token;
    return token;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate M-Pesa token");
  }
};

const stkPush = async (req, res) => {
  try {
    const token = await createToken();
    const shortCode = 174379;
    const phone = req.body.phone.substring(1);
    const amount = req.body.amount;
    const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

    const date = new Date();
    const timestamp =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    const password = new Buffer.from(shortCode + passkey + timestamp).toString(
      "base64"
    );

    const data = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: 600978,
      PartyB: 174379,
      PhoneNumber: `254${phone}`,
      CallBackURL: "https://mydomain.com/path",
      AccountReference: "Mpesa Test",
      TransactionDesc: "Testing stk push",
    };
    const response = await axios.post(url, data, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
};

module.exports = { createToken, stkPush };
