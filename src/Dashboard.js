import React from "react";
import { useState, useEffect } from "react";

function Dashboard(props) {
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
    redditGet("album", "all", "relevance");
  }, []);

  const [musicItems, setMusicItems] = useState([]);

  console.log(musicItems);

  return (
    <ul>
      {musicItems.map((item) => {
        return <li>{item}</li>;
      })}
    </ul>
  );
}

const searchPanel = (
  <div>
    <form>
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
  </div>
);

export default Dashboard;
