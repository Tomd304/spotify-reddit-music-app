const express = require("express");
var router = express.Router();
var controller = require("../controllers/spotify_controller");

router.get("/getSavedAlbums", controller.getSavedAlbums);

router.put("/saveAlbums", controller.saveAlbums);

router.delete("/removeAlbums", controller.removeAlbums);

module.exports = router;
