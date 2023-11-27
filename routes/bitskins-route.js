const router = require("express").Router();
const bitskinsController = require("../controllers/Bitskins-controller");

router.get('/', bitskinsController.getBitskins);

router.get('/:searchSkins', bitskinsController.getBitskinsName);


module.exports = router;