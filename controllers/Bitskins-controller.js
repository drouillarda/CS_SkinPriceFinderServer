const axios = require('axios');

const getBitskins = async (_req, res, next) => {
  const apiKey = "a1b1c4e460e59dfbe9b88fd7df3b1ce5e259a2e55b718dceffcd50acacce1e46";

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

module.exports = {
  getBitskins,
};