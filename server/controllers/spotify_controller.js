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

exports.getPlaylists = async (req, res) => {
  let url = "https://api.spotify.com/v1/me/playlists";
  let qs = {
    limit: 50,
    offset: 0,
  };
  let options = {
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
  let playlists = response.items.map((i) => {
    return { name: i.name, id: i.id };
  });
  while (total > qs.offset) {
    response = JSON.parse(await requestPromise(options));
    playlists.push(
      ...response.items.map((i) => {
        return { name: i.name, id: i.id };
      })
    );
    qs.offset += 50;
  }
  res.json({
    results: playlists,
  });
};

exports.createPlaylist = async (req, res) => {
  let url = "https://api.spotify.com/v1/me";
  let options = {
    url,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + globalVal.access_token,
    },
  };
  let response = JSON.parse(await requestPromise(options));
  let user_id = response.id;

  url = "https://api.spotify.com/v1/users/" + user_id + "/playlists";
  options = {
    url,
    method: "post",
    headers: {
      Authorization: "Bearer " + globalVal.access_token,
    },
    body: { name: "FRESH_ALERTS", public: true },
    json: true,
  };
  response = await requestPromise(options);
  res.json({ id: response.id });
};

exports.addPlaylistTracks = async (req, res) => {
  let url =
    " 	https://api.spotify.com/v1/playlists/" +
    req.query.playlist_id +
    "/tracks";

  let options = {
    url,
    method: "post",
    headers: {
      Authorization: "Bearer " + globalVal.access_token,
    },
    body: { uris: req.query.track_uris.split(",") },
    json: true,
  };
  let response = await requestPromise(options);
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
  res.json({ added: ids });
};

exports.removeAlbums = async (req, res) => {
  const ids = req.query.ids;
  let url = "https://api.spotify.com/v1/me/albums";
  let qs = {
    ids,
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
  res.json({ removed: ids });
};
