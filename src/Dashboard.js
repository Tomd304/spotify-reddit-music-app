import React from "react";
import { useState, useEffect } from "react";

function Dashboard(props) {
  const [searchOps, setSearchOps] = useState({
    q: "album",
    t: "all",
    sort: "relevance",
  });

  useEffect(() => {
    const redditGet = async (q, t, sort) => {
      const res = await fetch(
        "http://localhost:5000/search/reddit?" +
          new URLSearchParams({
            q,
            t,
            sort,
          })
      );
      const json = await res.json();
      setMusicItems(json.results);
    };
    redditGet(searchOps.q, searchOps.t, searchOps.sort);
  }, [searchOps]);

  const searchSubmit = (e) => {
    e.preventDefault();
    setSearchOps({
      q: e.target[0].value,
      t: e.target[1].value,
      sort: e.target[2].value,
    });
  };

  const [musicItems, setMusicItems] = useState([]);
  console.log(searchOps);
  return (
    <div>
      <form onSubmit={searchSubmit}>
        <select name="q">
          <option name="album" value="album">
            Album
          </option>
          <option name="song" value="song">
            Song
          </option>
        </select>
        <select name="t">
          <option name="all" value="all">
            All
          </option>
          <option name="year" value="year">
            Year
          </option>
          <option name="month" value="month">
            Month
          </option>
          <option name="week" value="week">
            Week
          </option>
          <option name="day" value="day">
            Day
          </option>
        </select>
        <select name="sort">
          <option name="relevance" value="relevance">
            Relevance
          </option>
          <option name="hot" value="hot">
            Hot
          </option>
          <option name="top" value="top">
            Top
          </option>
          <option name="new" value="new">
            New
          </option>
        </select>
        <button>Update</button>
      </form>
      <ul>
        {musicItems.map((item) => {
          return <li>{item}</li>;
        })}
      </ul>
    </div>
  );
}

export default Dashboard;
