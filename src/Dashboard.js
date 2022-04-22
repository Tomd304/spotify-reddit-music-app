import React from "react";
import { useState, useEffect } from "react";
import Card from "./components/Card";
import "./Dashboard.css";

function Dashboard(props) {
  const [searchOps, setSearchOps] = useState({
    q: "album",
    t: "all",
    sort: "relevance",
  });
  const [musicItems, setMusicItems] = useState([]);

  useEffect(() => {
    const redditGet = async (q, t, sort) => {
      const res = await fetch(
        "http://localhost:5000/search/getItems?" +
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

  return (
    <div>
      <form onSubmit={searchSubmit}>
        <select name="q">
          <option name="album" value="album">
            Albums
          </option>
          <option name="track" value="track">
            Tracks
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
      <ul className="card-container">
        {musicItems.length > 0 ? (
          musicItems.map((item) => {
            return (
              <Card item={item} />
              // <li style={{ border: "1px solid black", width: "250px" }}>
              //   <p>{item.name}</p>
              //   <p>{item.artist}</p>
              //   <img height={80} width={80} src={item.image} />
              // </li>
            );
          })
        ) : (
          <p>no results</p>
        )}
      </ul>
    </div>
  );
}

export default Dashboard;
