const requestPromise = require("request-promise");
const globalVal = require("../globalVariables");
const he = require("he");
const { format: prettyFormat } = require("pretty-format");

exports.getItems = async (req, res) => {
  const params = req.query;

  //Gets reddit API call results
  const redditData = await searchReddit(params.q, params.t, params.sort);

  //Parses reddit results into useable data (array of objects)
  const parsedRedditData = parseRedditData(redditData, params.q);

  //Gets and validates Spotify API results for reddit titles
  const details = await getSpotDetails(parsedRedditData);

  res.json({
    results: details,
  });
};

const searchReddit = async (q, t, sort) => {
  // Sets manual search string for Reddit API based on request
  q =
    q == "album"
      ? '"FRESH ALBUM" OR "FRESH EP" OR "FRESH MIXTAPE"'
      : '"[FRESH]" -"FRESH ALBUM" -"FRESH EP" -"FRESH MIXTAPE" -"VIDEO"';

  const queries = {
    q: q,
    sort: sort,
    t: t,
    restrict_sr: 1,
    limit: 40,
    after: "after",
  };

  const options = {
    url: "https://www.reddit.com/r/hiphopheads/search.json",
    method: "get",
    mode: "cors",
    qs: queries,
  };

  //Makes call to reddit API
  const res = JSON.parse(await requestPromise(options));

  //Stores array of results
  const data = res.data.children;

  //Stores after key to be used in next call
  const after = res.data.after;

  //Filters out results with low score / upvotes
  const filteredData = data.filter((child) => child.data.score > 5);
  return filteredData;
};

const parseRedditData = (list, requestType) => {
  //Sets orderID to reorder array as spotify data is not returned in order
  let orderID = -1;

  //Creates array of two types of object eith useable data from reddit api results.
  //Filtered by reddit results that include a spotify link, and those that do not.
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
    .replace("and", " ")
    .replace("/", " ")
    .replace("\\", " ")
    .replace("#", " ")
    .replace("&", " ")
    .replace('"', " ")
    .replace(":", " ");
  reducedStr = reducedStr.split(" - ")[0];
  reducedStr = reducedStr.includes("ft.")
    ? reducedStr.split("ft.")[0]
    : reducedStr;
  reducedStr = reducedStr.trim();
  return reducedStr;
};

const extractAlbum = (str) => {
  let reducedStr = str
    .replace(/\[[^()]*\]/g, "")
    .replace(/\([^()]*\)/g, "")
    .replace("and", " ")
    .replace("ft.", " ")
    .replace("/", " ")
    .replace("\\", " ")
    .replace("#", " ")
    .replace("&", " ");

  return reducedStr.split(" - ")[1];
};

const getSpotDetails = async (redditData) => {
  console.table(redditData);

  //Splits reddit results objects into 3 arrays. Spotify album urls, spotify track urls and Text for manual search
  const [albumData, trackData, strSearchData] = [
    redditData.filter((item) => item.spotifyType == "album"),
    redditData.filter((item) => item.spotifyType == "track"),
    redditData.filter((item) => item.type == "text"),
  ];

  //Makes different Spotify API calls depending on data supplied
  //Then combines results back into single array
  let spotifyResults = [
    ...(await getSpotItems(albumData, "album")),
    ...(await getSpotItems(trackData, "track")),
    ...(await getSpotSearches(strSearchData)),
  ];

  //Filters out none results & resorts array in order of original reddit results
  spotifyResults = spotifyResults
    .filter((item) => typeof item !== "undefined")
    .sort((a, b) =>
      a.orderID > b.orderID ? 1 : b.orderID > a.orderID ? -1 : 0
    );

  console.table(spotifyResults);

  return spotifyResults;
};

const getSpotItems = async (itemList, requestType) => {
  //if no results, return undefined array
  if (itemList.length == 0) {
    return [undefined];
  }

  let results = [];

  const chunkSize = 10;

  for (let i = 0; i < itemList.length; i += chunkSize) {
    //splits itemList into smaller array to not exceed API rate limit
    const chunk = itemList.slice(i, i + chunkSize);

    //Constructs url with multiple id's
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

    //Loops through spotify API res and creates useable object depending on album or track.
    if (requestType == "album") {
      chunk.forEach(function (item, i) {
        try {
          results.push({
            ...item,
            name: res.albums[i].name,
            image: res.albums[i].images[0].url,
            url: res.albums[i].external_urls.spotify,
            artist: {
              name: res.albums[i].artists[0].name,
              url: res.albums[i].artists[0].external_urls.spotify,
            },
            album: {
              name: res.albums[i].name,
              url: res.albums[i].external_urls.spotify,
            },
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
            url: res.tracks[i].external_urls.spotify,
            artist: {
              name: res.tracks[i].artists[0].name,
              url: res.tracks[i].artists[0].external_urls.spotify,
            },
            album: {
              name: res.tracks[i].album.name,
              url: res.tracks[i].album.external_urls.spotify,
            },
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
      //Searches spotify API using manually parsed artist & item terms extracted from reddit title for each item
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

      //Spotify API may return multiple results per search. Basic match on reddit title terms to try and specify correct item from list.
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
  if (albums.length == 0) {
    return false;
  } else if (albums.length == 1) {
    return albums[0];
  } else {
    //loop through search results and see if any terms match to reddit title terms
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
  }
  //ensures that a full album is not selected from spotify api results
  else if (tracks.length == 1 && tracks[0].album.album_type == "single") {
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
      //only checks first two results as further results are usually not relevant
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
