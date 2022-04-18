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

exports.reddit = async (req, res) => {
  params = req.query;
  results = await searchReddit(params.q, params.t, params.sort);
  res.json({
    results: results,
  });
};
