const express = require("express");
const port = 5000;
const cors = require("cors");

const authRouter = require("./routes/auth");
const searchRouter = require("./routes/search");
const spotifyRouter = require("./routes/spotify");

const mongoose = require("mongoose");

var app = express();

app.use(cors());
app.use("/auth", authRouter);
app.use("/search", searchRouter);
app.use("/spotify", spotifyRouter);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

module.exports = app;
