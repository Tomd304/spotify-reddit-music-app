const express = require("express");
var router = express.Router();
var controller = require("../controllers/auth_controller");

router.get("/login", controller.login);

router.get("/callback", controller.callback);

router.get("/token", controller.token);

module.exports = router;
