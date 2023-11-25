const router = require("express").Router();
const bitskinsController = require("../controllers/Bitskins-controller")

router.get('/', bitskinsController.getBitskins);


module.exports = router;