const router = require("express").Router();
const dmarketController = require("../controllers/Dmarket-controller")

// router.get('/', dmarketController.createTestTarget);

router.get('/:skinName', dmarketController.getDmarketSkin);

module.exports = router;