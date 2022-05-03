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
  const [musicItemsLoading, setMusicItemsLoading] = useState(true);
  const [albumLoading, setAlbumLoading] = useState(true);
  const [savedAlbums, setSavedAlbums] = useState([]);
  const [albumsSelected, setAlbumsSelected] = useState({
    toSave: [],
    toRemove: [],
  });

  useEffect(() => {
    const getSavedAlbums = async () => {
      console.log("getting saved");
      setAlbumLoading(true);
      const res = await fetch("http://localhost:5000/spotify/getSavedAlbums");
      const json = await res.json();
      setSavedAlbums(json.results);
      setAlbumLoading(false);
    };
    getSavedAlbums();
  }, []);

  useEffect(() => {
    const redditGet = async (q, t, sort) => {
      setMusicItemsLoading(true);
      const res = await fetch(
        "http://localhost:5000/search/getItems?" +
          new URLSearchParams({
            q,
            t,
            sort,
          })
      );
      const json = await res.json();
      console.log(json);
      setMusicItems(json.results);
      setMusicItemsLoading(false);
      console.log(musicItems);
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
          loading={albumLoading || musicItemsLoading ? true : false}
        />
        <ul className="card-container">
          {albumLoading || musicItemsLoading ? (
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
