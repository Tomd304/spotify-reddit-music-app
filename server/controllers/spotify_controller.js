const requestPromise = require("request-promise");
const globalVal = require("../globalVariables");

exports.getSavedAlbums = async (req, res) => {
  //Gets and validates Spotify API results for reddit titles
  let url = "https://api.spotify.com/v1/me/albums";
  let qs = {
    limit: 50,
    offset: 0,
  };

  const options = {
    url,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + globalVal.access_token,
    },
    qs,
  };

  let response = JSON.parse(await requestPromise(options));
  let total = response.total;
  qs.offset = 50;
  let ids = response.items.map((i) => i.album.id);
  while (total > qs.offset) {
    response = JSON.parse(await requestPromise(options));
    ids.push(...response.items.map((i) => i.album.id));
    qs.offset += 50;
  }
  console.log("wait");
  res.json({
    results: ids,
  });
};
