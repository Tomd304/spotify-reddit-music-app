const express = require("express");
var router = express.Router();
var controller = require("../controllers/spotify_controller");

router.get("/getSavedAlbums", controller.getSavedAlbums);

router.put("/saveAlbum", controller.saveAlbum);

router.delete("/removeAlbum", controller.removeAlbum);

module.exports = router;
