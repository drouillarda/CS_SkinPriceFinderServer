const router = require("express").Router();
const skinbaronController = require("../controllers/Skinbaron-controller");

router.get('/', skinbaronController.getSkinBaron);

router.get('/:searchSkins', skinbaronController.getSkinBaronSkin);

module.exports = router;