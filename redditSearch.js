const requestPromise = require("request-promise");

const search = async () => {
  qs = {
    restrict_sr: 1,
    limit: 100,
    q: '"FRESH ALBUM" OR "FRESH EP" OR "FRESH MIXTAPE"',
    after: "after",
  };

  const options = {
    url: "https://www.reddit.com/r/hiphopheads/search.json",
    method: "get",
    mode: "cors",
    qs: qs,
  };

  console.log("GETTING");
  const res = JSON.parse(await requestPromise(options)).data.children;
  data = res
    .filter((child) => child.data.url.includes("open.spotify"))
    .filter(
      (child) =>
        child.data.url.includes("track") || child.data.url.includes("album")
    )
    .map((child) => extractIDandType(child.data.url));
  console.table(data);
};

const extractIDandType = (str) => {
  console.log(str);
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

search();
