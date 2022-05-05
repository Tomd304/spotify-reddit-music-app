import React from "react";
import { useState, useEffect } from "react";
import Card from "./components/Card";
import SearchOptions from "./components/SearchOptions";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./Dashboard.css";
import axios from "axios";

const Dashboard = (props) => {
  const [searchOps, setSearchOps] = useState({
    q: "album",
    t: "year",
    sort: "top",
  });
  const [musicItems, setMusicItems] = useState([]);
  const [musicItemsLoading, setMusicItemsLoading] = useState(true);

  useEffect(() => {
    const redditGet = (q, t, sort) => {
      setMusicItemsLoading(true);
      console.log("calling");
      axios(
        "http://localhost:5000/search/getItems?" +
          new URLSearchParams({
            q,
            t,
            sort,
          }),
        {
          method: "get",
          headers: {
            Authorization: props.token,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      ).then((results) => {
        setMusicItems(results.data.results);
        setMusicItemsLoading(false);
      });
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
    <div className="view">
      <Header />
      <div className="dashboard">
        <SearchOptions
          searchSubmit={searchSubmit}
          loading={musicItemsLoading ? true : false}
        />
        <ul className="card-container">
          {musicItemsLoading ? (
            <p>Loading...</p>
          ) : musicItems.length > 0 ? (
            musicItems.map((item) => {
              return <Card item={item} />;
            })
          ) : (
            <p>No Results</p>
          )}
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
