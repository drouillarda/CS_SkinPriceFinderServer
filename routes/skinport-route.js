const router = require("express").Router();
const skinportController = require("../controllers/Skinport-controller");

router.get('/', skinportController.getSkinportSkins);

router.get('/:searchSkins', skinportController.getSkinportSkinsName);


module.exports = router;