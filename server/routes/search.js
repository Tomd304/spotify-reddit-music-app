const express = require("express");
var router = express.Router();
var controller = require("../controllers/search_controller");

router.get("/reddit", controller.reddit);

module.exports = router;
