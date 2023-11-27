const router = require("express").Router();
const steamController = require("../controllers/Steam-controller");

router.get('/', steamController.getSteam);

router.get('/:searchSkins', steamController.getSteamSkin);

module.exports = router;