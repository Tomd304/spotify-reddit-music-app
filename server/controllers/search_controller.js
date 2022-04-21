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
  const redditData = parseRedditData(
    res.filter((child) => child.data.score > 5),
    searchType
  );
  return redditData;
};

const parseRedditData = (list, requestType) => {
  let orderID = -1;
  const results = list.map((child) => {
    orderID += 1;
    let tempObj = {};
    if (child.data.url.includes("open.spotify.com")) {
      tempObj = {
        type: "spotify",
        id: extractID(child.data.url),
        spotifyType: extractSpotType(child.data.url),
      };
    } else {
      tempObj = {
        type: "text",
        redditArtist: extractArtist(he.decode(child.data.title)),
        redditAlbum: extractAlbum(he.decode(child.data.title)),
      };
    }
    return {
      orderID,
      requestType,
      redditTitle: he.decode(child.data.title).replace(/\[[^()]*\]/g, ""),
      timestamp: child.data.created,
      score: child.data.score,
      ...tempObj,
    };
  });
  return results;
};

const extractID = (str) => {
  let splitStr = str.split("open.spotify.com/")[1];
  let startIndex = splitStr.indexOf("/") + 1;
  return splitStr.substring(startIndex, startIndex + 22);
};

const extractSpotType = (str) => {
  return str.split("open.spotify.com/")[1].split("/")[0];
};

const extractArtist = (str) => {
  let reducedStr = str.replace(/\[[^()]*\]/g, "");
  return reducedStr.split(" - ")[0];
};

const extractAlbum = (str) => {
  let reducedStr = str.replace(/\[[^()]*\]/g, "");
  return reducedStr.split(" - ")[1];
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
  console.table(urlList);
  const albums = await getSpotAlbums(
    urlList.filter((item) => item.type == "spotify")
  );
  const searches = await getSpotSearches(
    urlList.filter((item) => item.type == "text")
  );
  console.table(
    [...albums, ...searches]
      .filter((item) => typeof item !== "undefined")
      .sort((a, b) =>
        a.orderID > b.orderID ? 1 : b.orderID > a.orderID ? -1 : 0
      )
  );
  return [...albums, ...searches]
    .filter((item) => typeof item !== "undefined")
    .sort((a, b) =>
      a.orderID > b.orderID ? 1 : b.orderID > a.orderID ? -1 : 0
    );
};

const getSpotAlbums = async (albumList) => {
  let url = "https://api.spotify.com/v1/albums/?ids=";
  albumList.forEach((item) => {
    url += item.id + ",";
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
  let spotResults = await Promise.all(
    searchList.map(async (item) => {
      let url = `https://api.spotify.com/v1/search?q=${encodeURI(
        item.redditArtist + " " + item.redditAlbum
      )}&type=${item.requestType}`;
      let options = {
        url,
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + globalVal.access_token,
        },
      };
      const res = JSON.parse(await requestPromise(options));
      const album = validateAlbum(
        res.albums.items,
        item.redditAlbum,
        item.redditArtist
      );
      if (album) {
        return {
          ...item,
          name: album.name,
          image: album.images[0].url,
          artist: album.artists[0].name,
          searchURL: url,
        };
      }
    })
  );
  return spotResults;
};

const validateAlbum = (albums, confirmation1, confirmation2) => {
  console.log("validating: " + confirmation1 + " / " + confirmation2);
  if (albums.length == 0) {
    return false;
  } else if (albums.length == 1) {
    return albums[0];
  } else {
    let found = false;
    let correctAlbum = {};
    albums.some((album) => {
      if (
        album.name == confirmation1.trim() ||
        album.name == confirmation2.trim()
      ) {
        correctAlbum = album;
        found = true;
        return "exit loop";
      }
    });
    return found ? correctAlbum : albums[0];
  }
};
