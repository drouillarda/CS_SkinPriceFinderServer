const axios = require('axios');
const apiKey = "1799214-1509efb8-94c0-4a90-bbe4-eabeef9080bd";

const makeSkinBaronRequest = async () => {
    const postBody = {
      "apikey": apiKey,
      "appId": 730
    };
  
    const response = await axios.post("https://api.skinbaron.de/GetPriceList", postBody, {
      headers: {
        "content-type": "application/json",
        "x-requested-with": "XMLHttpRequest",
        "x-apikey": apiKey,
      },
    });
  
    return response.data;
  };

const getSkinBaron = async (_req, res, next) => {
    try {
    const skinbaronData = await makeSkinBaronRequest();
    res.status(200).json(skinbaronData);
  } catch (error) {
    res.status(500).json({error: `Error getting Bitskins data: ${error}` });
  }
  next();
};

const getSkinBaronSkin = async (req, res, next) => {
    const { searchSkins } = req.params;
    try {
      
      const skinbaronData = await makeSkinBaronRequest(); 
      const { map } = skinbaronData;
      if (searchSkins) {
      const lowerCaseSearch = searchSkins.toLowerCase();
      const selectedSkin = map.find(skin => skin.name.toLowerCase() === lowerCaseSearch);
      
      if (!selectedSkin) {
      return res.status(404).json({ message: `Skin with name ${searchSkins} not found.` });
      }
      return res.status(200).json(selectedSkin);
    }
      res.status(200).json(skinbaron.data);
    } catch (error) {
      res.status(500).json({error: `Error getting Bitskins data: ${error}` });
    }
    next();
  };

module.exports = {
    getSkinBaron,
    getSkinBaronSkin,
  };