const globalVal = require("../globalVariables");
const request = require("request");

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

exports.login = (req, res) => {
  console.log("Login Started");
  console.log(globalVal);
  console.log(globalVal.spotify_client_id);
  console.log(globalVal.spotify_client_secret);
  var scope =
    "user-library-read user-library-modify user-read-email user-read-private";

  var state = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: globalVal.spotify_client_id,
    scope: scope,
    redirect_uri: "http://localhost:5000/auth/callback",
    state: state,
  });
  console.log("Login redirecting");
  res.redirect(
    "https://accounts.spotify.com/authorize/?" +
      auth_query_parameters.toString()
  );
};

exports.callback = (req, res) => {
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
        Buffer.from(
          globalVal.spotify_client_id + ":" + globalVal.spotify_client_secret
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    json: true,
  };
  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      globalVal.access_token = body.access_token;
      console.log("Token saved, redirecting to frontend");
      console.log("ACCESS TOKEN IS: " + globalVal.access_token);
      res.redirect("http://localhost:3000/");
    }
  });
};

exports.token = (req, res) => {
  res.json({
    access_token: globalVal.access_token,
  });
};
