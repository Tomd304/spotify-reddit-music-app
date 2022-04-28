const express = require("express");
var router = express.Router();
var controller = require("../controllers/spotUser_controller");

router.get("/getPlaylists", controller.getPlaylists);

module.exports = router;
