const express = require("express");
const app = express();
const cors = require("cors");

/*CHANGE*/
const baseUri = "https://boxingboyz.com";

app.use(cors());

function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

app.get("/token/:tokenId.json", async (req, res) => {
  let tokenId = req.params.tokenId;

  if (!isNumeric(tokenId)) {
    res.sendStatus(404);
    return;
  }

  res.setHeader("Content-Type", "application/json");

  /*let value = cache.get(tokenId);
  if (value !== undefined) {
    res.json(value);
    return;
  }*/

  try {
    let result = {
      name: "#" + tokenId,
      description: "Unrevealed BoxingBoyz",
      image: `${baseUri}/assets/img/RevealCW.png`,
      attributes: [],
    };

    if (tokenId == 0) {
      result.image = `${baseUri}/assets/img/RevealCG.png`;
    }
    //cache.set(tokenId, result);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
});
app.get("/token/customs/:tokenId.json", async (req, res) => {
  let tokenId = req.params.tokenId;

  if (!isNumeric(tokenId)) {
    res.sendStatus(404);
    return;
  }

  res.setHeader("Content-Type", "application/json");

  try {
    let result = {
      name: "#" + tokenId,
      description: "Unrevealed BoxingBoyz",
      image: `${baseUri}/assets/customs/${tokenId}.png`,
      attributes: [],
    };

    res.json(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
});

app.get("/cinfo/main.json", async (req, res) => {
  res.json({
    name: "BoxingBoyz",
    description:
      "The Boxing Boyz is a 3D animated NFT collection of 10,000 unique Boxing characters with 150 different elements. We combine the real boxing world with the digital revolution through a play to earn game.",
    image: "https://www.boxingboyz.com/logo512.png",
    external_link: "https://www.boxingboyz.com",
  });
});
app.get("/cinfo/customs.json", async (req, res) => {
  res.json({
    name: "BoxingBoyz Customs",
    description:
      "The Boxing Boyz is a 3D animated NFT collection of 10,000 unique Boxing characters with 150 different elements. We combine the real boxing world with the digital revolution through a play to earn game. This collection contains all custom BoxingBoyz.",
    image: "https://www.boxingboyz.com/logo512.png",
    external_link: "https://www.boxingboyz.com",
  });
});

app.listen(80, () => {
  console.log("running");
});
