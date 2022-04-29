const requestPromise = require("request-promise");
const globalVal = require("../globalVariables");

exports.getSavedAlbums = async (req, res) => {
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

exports.saveAlbums = async (req, res) => {
  const ids = req.query.ids;
  let url = "https://api.spotify.com/v1/me/albums";
  let qs = {
    ids,
  };

  const options = {
    url,
    method: "put",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + globalVal.access_token,
    },
    qs,
  };
  console.log("saving");

  const response = requestPromise(options);
  console.log(response);
  res.json({ added: ids });
};

exports.removeAlbum = async (req, res) => {
  const id = req.query.id;
  let url = "https://api.spotify.com/v1/me/albums";
  let qs = {
    ids: id,
  };

  const options = {
    url,
    method: "delete",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + globalVal.access_token,
    },
    qs,
  };
  const response = await requestPromise(options);
  console.log(response);
};
