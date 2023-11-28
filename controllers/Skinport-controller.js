const axios = require('axios');

const apiKey = process.env.SKINPORT_KEY;
const secretKey = process.env.SKINPORT_SECRET_KEY;

const getSkinportSkins = async (_req, res, next) => {
    try {
        const credentials = Buffer.from(`${apiKey}:${secretKey}`).toString('base64'); 
        const Skinport = await axios.get("https://api.skinport.com/v1/items", {
          "headers": {
            "content-type": "application/json",
            "x-apikey": apiKey,
            "Authorization":  `Basic ${credentials}`
          },
        })
        res.status(200).json(Skinport.data);
      } catch (error) {
        res.status(500).json({error: `Error getting Skinport data: ${error}` });
      }
      next();
};

const getSkinportSkinsName = async (req, res, next) => {
    const { searchSkins } = req.params;

    try {
        const credentials = Buffer.from(`${apiKey}:${secretKey}`).toString('base64');
        const Skinport = await axios.get("https://api.skinport.com/v1/items", {
            "headers": {
                "content-type": "application/json",
                "x-apikey": apiKey,
                "Authorization":  `Basic ${credentials}`
      },
    });

    const skinportName = Skinport.data;
    console.log(skinportName);
    if (searchSkins) {
      const lowerCaseSearch = searchSkins.toLowerCase();
      const selectedSkin = skinportName.find(skin => skin.market_hash_name.toLowerCase() === lowerCaseSearch);
      
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
    getSkinportSkins,
    getSkinportSkinsName,
  };