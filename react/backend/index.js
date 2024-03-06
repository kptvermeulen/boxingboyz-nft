const express = require("express");
const app = express();
const cors = require("cors");
var bodyParser = require("body-parser");
app.use(bodyParser.json());
const { promisify } = require("util");
const fetch = require("node-fetch");

app.use(cors({ origin: "*" }));

const { GoogleSpreadsheet } = require("google-spreadsheet");
const doc = new GoogleSpreadsheet("PRIVATE");

let sheet;
let creds;

async function Getdata() {
  creds = require("./client_secret.json");
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  sheet = doc.sheetsByIndex[0];
}
Getdata();

app.post("/add-wallet-safe", async (req, res) => {
  if (sheet !== undefined && req.body.safeEntry === creds.safeEntry) {
    let address = req.body.address;
    if (req.body.walletworth !== undefined) {
      let walletworth = "wallet value not available";
      await fetch(
        "https://api.zapper.fi/v1/protocols/tokens/balances?api_key=PRIVATEKEY&addresses[]=" +
          address.toString()
      )
        .then((res2) => res2.json())
        .then((json) => {
          if (json.statusCode === 400) {
            res.sendStatus(404);
          }
          walletworth = Math.round(json[Object.keys(json)[0]].meta[0].value);
        });
      console.log(address);
      const date = new Date();
      await sheet.addRows([
        {
          date: date.toLocaleString("nl-NL"),
          address: address,
          worth: walletworth,
        },
      ]);
      res.send("succes");
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(404);
  }
});
app.get("/test", async (req, res) => {
  console.log("test");
  res.send("test");
});

app.listen(80, () => {
  console.log("running");
});
