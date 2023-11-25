const router = require("express").Router();
const dmarketController = require("../controllers/Dmarket-controller")

router.get('/', dmarketController.getDmarket);

module.exports = router;