const express = require("express");
var router = express.Router();
var controller = require("../controllers/spotify_controller");

router.get("/getSavedAlbums", controller.getSavedAlbums);

router.get("/getPlaylists", controller.getPlaylists);

router.put("/saveAlbums", controller.saveAlbums);

router.put("/createPlaylist", controller.createPlaylist);

router.put("/addPlaylistTracks", controller.addPlaylistTracks);

router.delete("/removeAlbums", controller.removeAlbums);

module.exports = router;
