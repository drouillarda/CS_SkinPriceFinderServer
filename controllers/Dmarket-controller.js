const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  const apiUrl = 'https://api.dmarket.com/price-aggregator/v1/aggregated-prices';

  try {
    const response = await axios.get(apiUrl);
    console.log('Request success', response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Request failed', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;