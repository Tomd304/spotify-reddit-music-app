import React from "react";
import { useState, useEffect } from "react";
import Card from "./components/Card";
import SearchOptions from "./components/SearchOptions";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./Dashboard.css";

const Dashboard = (props) => {
  const [searchOps, setSearchOps] = useState({
    q: "album",
    t: "year",
    sort: "top",
  });
  const [musicItems, setMusicItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedAlbums, setSavedAlbums] = useState([]);
  const getSavedAlbums = async () => {
    console.log("getting saved");
    const res = await fetch("http://localhost:5000/spotify/getSavedAlbums");
    const json = await res.json();
    setSavedAlbums(json.results);
  };
  useEffect(() => {
    getSavedAlbums();
  }, []);

  useEffect(() => {
    const redditGet = async (q, t, sort) => {
      setLoading(true);
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
      setLoading(false);
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

  const addSavedAlbum = async (id) => {
    fetch(
      "http://localhost:5000/spotify/saveAlbum?" +
        new URLSearchParams({
          id,
        }),
      { method: "put" }
    );
    setSavedAlbums([...savedAlbums, id]);
  };

  const removeSavedAlbum = async (id) => {
    fetch(
      "http://localhost:5000/spotify/removeAlbum?" +
        new URLSearchParams({
          id,
        }),
      { method: "delete" }
    );
    setSavedAlbums([...savedAlbums].filter((i) => i !== id));
  };

  return (
    <div className="view">
      <Header />
      <div className="dashboard">
        <SearchOptions searchSubmit={searchSubmit} loading={loading} />
        <ul className="card-container">
          {loading ? (
            <p>Loading...</p>
          ) : musicItems.length > 0 ? (
            musicItems.map((item) => {
              return (
                <Card
                  item={item}
                  addSavedAlbum={addSavedAlbum}
                  removeSavedAlbum={removeSavedAlbum}
                  saved={savedAlbums.includes(item.id) ? true : false}
                />
              );
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
