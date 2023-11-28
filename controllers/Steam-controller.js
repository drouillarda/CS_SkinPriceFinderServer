const axios = require('axios');
const apiKey = process.env.STEAM_KEY;

const getSteam = async (_req, res, next) => {

  try {
    const Steam = await axios.get(`https://api.steamapis.com/market/items/730?api_key=${apiKey}`)
    res.status(200).json(Steam.data);
  } catch (error) {
    res.status(500).json({error: `Error getting Steam data: ${error}` });
  }
  next();
};

const getSteamSkin = async (req, res, next) => {
    const { searchSkins } = req.params;
    try {
      const Steam = await axios.get(`https://api.steamapis.com/market/item/730/${searchSkins}?api_key=${apiKey}`);
      res.status(200).json(Steam.data);
    } catch (error) {
      res.status(500).json({error: `Error getting Steam data: ${error}` });
    }
    next();
  };

module.exports = {
  getSteam,
  getSteamSkin,
};