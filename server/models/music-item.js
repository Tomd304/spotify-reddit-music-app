let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let MusicItemSchema = new Schema({
  album: { type: Schema.Types.ObjectId, ref: "Album" },
  artist: { type: Schema.Types.ObjectId, ref: "Artist" },
  _id: { type: String, required: true },
  image: { type: String, required: true },
  name: { type: String, required: true },
  released: { type: String, required: true },
  requestType: { type: String, required: true },
  spotifyType: { type: String, required: true },
  timestamp: { type: Date, required: true },
  url: { type: String, required: true },
});

module.exports = mongoose.model("MusicItem", MusicItemSchema);
