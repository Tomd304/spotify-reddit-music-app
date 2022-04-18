const express = require("express");
const port = 5000;
const cors = require("cors");

const authRouter = require("./routes/auth");
const searchRouter = require("./routes/search");

var app = express();

app.use(cors());
app.use("/auth", authRouter);
app.use("/search", searchRouter);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

module.exports = app;
