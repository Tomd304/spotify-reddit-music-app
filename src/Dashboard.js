import React from "react";
import { useState, useEffect } from "react";
import Card from "./components/Card";
import SearchOptions from "./components/SearchOptions";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PlaylistLink from "./components/PlaylistLink";
import Modal from "./components/Modal";
import "./Dashboard.css";

function Dashboard(props) {
  const [searchOps, setSearchOps] = useState({
    q: "album",
    t: "year",
    sort: "top",
  });
  const [musicItems, setMusicItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [activePlaylist, setActivePlaylist] = useState();

  useEffect(() => {
    const redditGet = async (q, t, sort) => {
      setLoading(true);
      console.log("api fetch");
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

  const openPlaylistModal = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/spotUser/getPlaylists");
    const json = await res.json();
    setUserPlaylists(
      json.results.map((i) => {
        return { name: i.name, id: i.id };
      })
    );
    document.body.style.overflow = "hidden";
    setShowModal(true);
  };

  const closePlaylistModal = async (e) => {
    e.preventDefault();
    document.body.style.overflow = "";
    setShowModal(false);
  };

  return (
    <div className="view">
      {showModal ? (
        <Modal closeModal={closePlaylistModal} userPlaylists={userPlaylists} />
      ) : null}
      <Header />
      <div className="dashboard">
        <SearchOptions searchSubmit={searchSubmit} loading={loading} />
        <PlaylistLink onClick={openPlaylistModal} />
        <ul className="card-container">
          {loading ? (
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
}

export default Dashboard;
