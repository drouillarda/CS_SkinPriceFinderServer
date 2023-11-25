const router = require("express").Router();
const dmarketController = require("../controllers/Dmarket-controller")

router.get('/', dmarketController.getDmarket);

router.get('/:skinName', dmarketController.getDmarketName);

module.exports = router;