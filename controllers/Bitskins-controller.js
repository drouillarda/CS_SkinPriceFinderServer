const axios = require('axios');
const apiKey = process.env.BITSKINS_KEY;

const getBitskins = async (_req, res, next) => {

  try {
    const bitskins = await axios.get("https://api.bitskins.com/market/insell/730", {
      "headers": {
        "content-type": "application/json",
        "x-apikey": apiKey,
      },
    })
    res.status(200).json(bitskins.data);
  } catch (error) {
    res.status(500).json({error: `Error getting Bitskins data: ${error}` });
  }
  next();
};

const getBitskinsName = async (req, res, next) => {
    const { searchSkins } = req.params;

    try {
    const bitskins = await axios.get("https://api.bitskins.com/market/insell/730", {
      "headers": {
        "content-type": "application/json",
        "x-apikey": apiKey,
      },
    });

    const { list } = bitskins.data;
    if (searchSkins) {
      const lowerCaseSearch = searchSkins.toLowerCase();
      const selectedSkin = list.find(skin => skin.name.toLowerCase() === lowerCaseSearch);
      
      if (!selectedSkin) {
      return res.status(404).json({ message: `Skin with name ${searchSkins} not found.` });
      }
      return res.status(200).json(selectedSkin);
    }
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ error: `Error getting skin: ${error}` });
  }
  next();
};

module.exports = {
  getBitskins,
  getBitskinsName,
};