import React from "react";
import { useState, useEffect } from "react";
import Card from "./components/Card";
import SearchOptions from "./components/SearchOptions";
import "./Dashboard.css";

function Dashboard(props) {
  const [searchOps, setSearchOps] = useState({
    q: "album",
    t: "year",
    sort: "top",
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
      sort: e.target[1].value,
      t: e.target[2].value,
    });
  };

  return (
    <div>
      <SearchOptions searchSubmit={searchSubmit} />
      <ul className="card-container">
        {musicItems.length > 0 ? (
          musicItems.map((item) => {
            return <Card item={item} />;
          })
        ) : (
          <p>no results</p>
        )}
      </ul>
    </div>
  );
}

export default Dashboard;
