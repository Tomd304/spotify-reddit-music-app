let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let ArtistSchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Artist", ArtistSchema);
