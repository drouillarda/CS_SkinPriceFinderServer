const axios = require('axios');
const { response } = require('express');
const apiKey = "a1b1c4e460e59dfbe9b88fd7df3b1ce5e259a2e55b718dceffcd50acacce1e46";

const getBitskins = async (_req, res, next) => {

  try {
    const Bitskins = await axios.get("https://api.bitskins.com/market/insell/730", {
      "headers": {
        "content-type": "application/json",
        "x-apikey": apiKey,
      },
    })
    res.status(200).json(Bitskins.data);
  } catch (error) {
    res.status(500).json({error: `Error getting Bitskins data: ${error}` });
  }
  next();
};

const getBitskinsName = async (_req, res, next) => {
    const { searchSkins } = _req.query;

    try {
    const Bitskins = await axios.get("https://api.bitskins.com/market/insell/730", {
      "headers": {
        "content-type": "application/json",
        "x-apikey": apiKey,
      },
    });

    const skinsFound = Bitskins.data.list;
    if (searchSkins) {
      const selectedSkin = skinsFound.find(skin => skin.name === searchSkins)
      if (!selectedSkin) {
      return res.status(404).json({ message: `Skin with name ${searchSkins} not found.` });
      }
      return res.status(200).json(selectedSkin);
    }
    res.status(200).json(skinsFound);
  } catch (error) {
    res.status(500).json({ error: `Error getting skin: ${error}` });
  }
  next();
};

module.exports = {
  getBitskins,
  getBitskinsName,
};