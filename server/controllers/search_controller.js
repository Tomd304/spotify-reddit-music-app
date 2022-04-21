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
  let splitStr = str.split(".spotify.com/")[1];

  let startIndex;
  try {
    startIndex = splitStr.indexOf("/") + 1;
  } catch (err) {
    console.log(err);
    console.log(str);
  }

  return splitStr.substring(startIndex, startIndex + 22);
};

const extractSpotType = (str) => {
  return str.split(".spotify.com/")[1].split("/")[0];
};

const extractArtist = (str) => {
  let reducedStr = str
    .replace(/\[[^()]*\]/g, "")
    .replace(/\([^()]*\)/g, "")
    .replace("and", "")
    .replace("ft.", "")
    .replace("/", "")
    .replace("\\", "")
    .replace("#", "");

  return reducedStr.split(" - ")[0];
};

const extractAlbum = (str) => {
  let reducedStr = str
    .replace(/\[[^()]*\]/g, "")
    .replace(/\([^()]*\)/g, "")
    .replace("and", "")
    .replace("ft.", "")
    .replace("/", "")
    .replace("\\", "")
    .replace("#", "");

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
  const albums = await getSpotItems(
    urlList.filter((item) => item.spotifyType == "album"),
    "album"
  );
  const tracks = await getSpotItems(
    urlList.filter((item) => item.spotifyType == "track"),
    "track"
  );
  const searches = await getSpotSearches(
    urlList.filter((item) => item.type == "text")
  );
  console.table(
    [...albums, ...tracks, ...searches]
      .filter((item) => typeof item !== "undefined")
      .sort((a, b) =>
        a.orderID > b.orderID ? 1 : b.orderID > a.orderID ? -1 : 0
      )
  );
  return [...albums, ...tracks, ...searches]
    .filter((item) => typeof item !== "undefined")
    .sort((a, b) =>
      a.orderID > b.orderID ? 1 : b.orderID > a.orderID ? -1 : 0
    );
};

const getSpotItems = async (itemList, requestType) => {
  if (itemList.length == 0) {
    return [undefined];
  }
  let results = [];
  const chunkSize = 10;
  for (let i = 0; i < itemList.length; i += chunkSize) {
    const chunk = itemList.slice(i, i + chunkSize);

    let url = `https://api.spotify.com/v1/${requestType}s/?ids=`;

    chunk.forEach((item) => {
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
    if (requestType == "album") {
      chunk.forEach(function (item, i) {
        try {
          results.push({
            ...item,
            name: res.albums[i].name,
            image: res.albums[i].images[0].url,
            artist: res.albums[i].artists[0].name,
          });
        } catch (err) {
          console.log("missing details for:");
          console.table(item);
        }
      });
    } else if (requestType == "track") {
      chunk.forEach(function (item, i) {
        try {
          results.push({
            ...item,
            name: res.tracks[i].name,
            image: res.tracks[i].album.images[0].url,
            artist: res.tracks[i].album.artists[0].name,
          });
        } catch (err) {
          console.log("missing details for:");
          console.table(item);
        }
      });
    }
  }
  return results;
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
      const selectedItem =
        item.requestType == "album"
          ? validateAlbum(res.albums.items, item.redditAlbum, item.redditArtist)
          : validateTrack(
              res.tracks.items,
              item.redditAlbum,
              item.redditArtist
            );
      if (selectedItem) {
        if (selectedItem.type == "track") {
          return {
            ...item,
            name: selectedItem.album.name,
            image: selectedItem.album.images[0].url,
            artist: selectedItem.album.artists[0].name,
            searchURL: url,
          };
        }
        return {
          ...item,
          name: selectedItem.name,
          image: selectedItem.images[0].url,
          artist: selectedItem.artists[0].name,
          searchURL: url,
        };
      }
    })
  );
  return spotResults;
};

const validateAlbum = (albums, confirmation1, confirmation2) => {
  if (confirmation2 && confirmation2.includes("Kids")) {
    console.log("stop");
  }
  if (albums.length == 0) {
    return false;
  } else if (albums.length == 1) {
    return albums[0];
  } else {
    let found = false;
    let correctAlbum = {};
    albums.some((album) => {
      if (
        typeof confirmation1 !== "undefined" &&
        typeof confirmation2 !== "undefined" &&
        (album.name.toUpperCase() == confirmation1.trim().toUpperCase() ||
          album.name.toUpperCase() == confirmation2.trim().toUpperCase())
      ) {
        correctAlbum = album;
        found = true;
        return "exit loop";
      }
    });
    return found ? correctAlbum : albums[0];
  }
};

const validateTrack = (tracks) => {
  if (tracks.length == 0) {
    return false;
  } else if (tracks.length == 1 && tracks[0].album.album_type == "single") {
    return tracks[0].album;
  } else {
    let found = false;
    let correctTrack = {};
    let counter = 0;
    tracks.some((track) => {
      if (track.album.album_type == "single") {
        correctTrack = track;
        found = true;
        return "exit loop";
      }
      if (counter > 1) {
        found = false;
        return "exit loop";
      }
      counter += 1;
    });
    return found
      ? correctTrack
      : tracks[0].album.album_type == "single"
      ? tracks[0]
      : false;
  }
};

// const validateTrack = (tracks, confirmation1, confirmation2) => {
//   if (tracks.length == 0) {
//     return false;
//   } else if (tracks.length == 1) {
//     return tracks[0].album;
//   } else {
//     let found = false;
//     let correctTrack = {};
//     tracks.some((track) => {
//       if (
//         track.name == confirmation1.trim() ||
//         track.name == confirmation2.trim()
//       ) {
//         correctTrack = track;
//         found = true;
//         return "exit loop";
//       }
//     });
//     return found ? correctTrack : tracks[0];
//   }
// };
