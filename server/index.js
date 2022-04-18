const express = require("express");
const dotenv = require("dotenv");
const request = require("request");
const port = 5000;
const cors = require("cors");

dotenv.config();

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
var access_token = "";
var app = express();

app.use(cors());

app.get("/auth/login", (req, res) => {
  console.log("Login Started");
  var scope =
    "streaming \
                    user-read-email \
                    user-read-private";

  var state = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: "http://localhost:5000/auth/callback",
    state: state,
  });
  console.log("Login redirecting");
  res.redirect(
    "https://accounts.spotify.com/authorize/?" +
      auth_query_parameters.toString()
  );
});

app.get("/auth/callback", (req, res) => {
  var code = req.query.code;
  console.log("Callback Started");
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: "http://localhost:5000/auth/callback",
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString(
          "base64"
        ),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    json: true,
  };
  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      console.log("Token saved, redirecting to frontend");
      console.log("ACCESS TOKEN IS: " + access_token);
      res.redirect("http://localhost:3000/");
    }
  });
});

app.get("/auth/token", (req, res) => {
  res.json({
    access_token: access_token,
  });
});

const requestPromise = require("request-promise");

const searchReddit = async (q, t, sort) => {
  q =
    q == "album"
      ? '"FRESH ALBUM" OR "FRESH EP" OR "FRESH MIXTAPE"'
      : '"[FRESH]" -"FRESH ALBUM" -"FRESH EP" -"FRESH MIXTAPE" -"VIDEO"';

  const queries = {
    q: q,
    sort: sort,
    t: t,
    restrict_sr: 1,
    limit: 100,
    after: "after",
  };

  const options = {
    url: "https://www.reddit.com/r/hiphopheads/search.json",
    method: "get",
    mode: "cors",
    qs: queries,
  };

  const res = JSON.parse(await requestPromise(options)).data.children;
  const redditURLS = res
    .filter((child) => child.data.url.includes("open.spotify.com"))
    .map((child) => {
      return extractIDandType(child.data.url);
    });

  return redditURLS;
};

const extractIDandType = (str) => {
  let id = str.substring(str.lastIndexOf("/") + 1);
  if (id.includes("?")) {
    id = str.substring(str.lastIndexOf("/") + 1, str.lastIndexOf("?"));
  }
  if (id.includes("&")) {
    id = str.substring(str.lastIndexOf("/") + 1, str.lastIndexOf("&"));
  }

  let type = str.includes("/album/") ? "albums" : "tracks";
  let url = "https://api.spotify.com/v1/" + type + "/" + id;

  return url;
};

app.get("/search/reddit", async (req, res) => {
  params = req.query;
  results = await searchReddit(params.q, params.t, params.sort);
  res.json({
    results: results,
  });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

//generate random string to use as state parameter in spotify api request
const generateRandomString = (length) => {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
