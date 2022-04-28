const requestPromise = require("request-promise");
const globalVal = require("../globalVariables");

exports.getPlaylists = async (req, res) => {
  let options = {
    url: "https://api.spotify.com/v1/me/playlists",
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + globalVal.access_token,
    },
  };
  const results = JSON.parse(await requestPromise(options));
  console.log(results.items);
  res.json({
    results: results.items,
  });
};
