const requestPromise = require("request-promise");
const globalVal = require("../globalVariables");
const he = require("he");
const { format: prettyFormat } = require("pretty-format");

const searchReddit = async (q, t, sort) => {
  const searchType = q == "album" ? "album" : "track";
  q =
    q == "album"
      ? '"FRESH ALBUM" OR "FRESH EP" OR "FRESH MIXTAPE"'
      : '"[FRESH]" -"FRESH ALBUM" -"FRESH EP" -"FRESH MIXTAPE" -"VIDEO"';

  const queries = {
    q: q,
    sort: sort,
    t: t,
    restrict_sr: 1,
    limit: 15,
    after: "after",
  };

  const options = {
    url: "https://www.reddit.com/r/hiphopheads/search.json",
    method: "get",
    mode: "cors",
    qs: queries,
  };

  const res = JSON.parse(await requestPromise(options)).data.children;
  const testURLS = parseRedditAlbums(res, searchType).filter(
    (child) => child.score > 5
  );

  return testURLS;
};

const parseRedditAlbums = (list, searchType) => {
  const results = list.map((child) => {
    let type, data;
    if (child.data.url.includes("open.spotify.com")) {
      type = "spotify";
      data = extractIDandType(child.data.url);
    } else {
      type = "text";
      data = he.decode(child.data.title.split("]").pop()).replace("-", " ");
    }
    return {
      type,
      data,
      title: he.decode(child.data.title),
      timestamp: child.data.created,
      score: child.data.score,
      searchType,
    };
  });
  return results;
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

exports.getItems = async (req, res) => {
  const params = req.query;
  const results = await searchReddit(params.q, params.t, params.sort);
  const details = await getSpotDetails(results);
  res.json({
    results: details,
  });
};

const getSpotDetails = async (urlList) => {
  const albums = await getSpotAlbums(
    urlList.filter((item) => item.type == "spotify")
  );
  const searches = await getSpotSearches(
    urlList.filter((item) => item.type == "text")
  );
  console.log("***********ALBUMS*****************");
  console.log(prettyFormat(albums));
  console.log("***********SEARCHES*****************");
  console.log(prettyFormat(searches));
};

const getSpotAlbums = async (albumList) => {
  let url = "https://api.spotify.com/v1/albums/?ids=";
  albumList.forEach((item) => {
    url += item.data.split("/albums/")[1] + ",";
  });
  url = url.slice(0, -1);
  const options = {
    url,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + globalVal.access_token,
    },
  };
  const res = JSON.parse(await requestPromise(options));
  return albumList.map(function (item, i) {
    return {
      ...item,
      name: res.albums[i].name,
      image: res.albums[i].images[0].url,
      artist: res.albums[i].artists[0].name,
    };
  });
};

const getSpotSearches = async (searchList) => {
  console.table(searchList);
  let spotResults = await Promise.all(
    searchList.map(async (item) => {
      let url = `https://api.spotify.com/v1/search?q=${encodeURI(
        item.data.trim()
      )}&type=${item.searchType}`;
      let options = {
        url,
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + globalVal.access_token,
        },
      };
      const res = JSON.parse(await requestPromise(options));
      if (res.albums.items[0]) {
        return {
          ...item,
          name: res.albums.items[0].name,
          image: res.albums.items[0].images[0].url,
          artist: res.albums.items[0].artists[0].name,
        };
      }
    })
  );
  return spotResults;
};
