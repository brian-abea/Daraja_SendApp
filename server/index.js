const express = require("express");

const app = express();
const TokenRoute= require("./routes/token");


app.listen(5000, () => {
  console.log("server run nicely");
});


app.use(express.json ());
app.get("/", (req, res) => {
  res.send("Mpesa backend");
})

app.use("/token", TokenRoute)