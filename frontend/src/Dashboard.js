import React from "react";
import { useState, useEffect } from "react";
import Modal from "./components/Modal";
import Header from "./components/Header";
import SearchOptions from "./components/SearchOptions";
import CardContainer from "./components/CardContainer";
import Footer from "./components/Footer";
import "./Dashboard.css";
import axios from "axios";

const Dashboard = (props) => {
  const [searchOps, setSearchOps] = useState({
    q: "album",
    t: "week",
    sort: "top",
  });
  const [musicItems, setMusicItems] = useState([]);
  const [musicItemsLoading, setMusicItemsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [shareInfo, setShareInfo] = useState({});
  const [savedAlbums, setSavedAlbums] = useState([]);

  const getSavedAlbums = async () => {
    console.log("getting saved");
    console.time("savedAlbums");
    let url = process.env.REACT_APP_BACKEND_URL + "spotify/getSavedAlbums";
    let res = await fetch(url, {
      headers: { Authorization: props.token },
    });
    let json = await res.json();
    console.timeEnd("savedAlbums");
    setSavedAlbums(json.results);
  };

  useEffect(() => {
    const redditGet = (q, t, sort) => {
      setMusicItemsLoading(true);
      console.log("token in props: " + props.token);
      try {
        axios(
          process.env.REACT_APP_BACKEND_URL +
            "search/getItems?" +
            new URLSearchParams({
              q,
              t,
              sort,
            }),
          {
            method: "get",
            headers: {
              Authorization: props.token,
              "Content-Type": "application/json",
            },
          }
        ).then((results) => {
          setMusicItems(results.data.results);
        });
      } catch (e) {
        console.log("failed....");
        console.log(e);
      }
    };
    const apiCalls = async () => {
      await Promise.all([
        getSavedAlbums(),
        redditGet(searchOps.q, searchOps.t, searchOps.sort),
      ]);
      setMusicItemsLoading(false);
    };
    apiCalls();
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
    console.log("sending");
    console.log(id);
    const res = await fetch(
      process.env.REACT_APP_BACKEND_URL +
        "spotify/saveAlbum?" +
        new URLSearchParams({
          id,
        }),
      {
        method: "put",
        headers: {
          Authorization: props.token,
        },
      }
    );
    if (res.status == 200) {
      setSavedAlbums([...savedAlbums, id]);
      return true;
    } else {
      return false;
    }
  };

  const removeSavedAlbum = async (id) => {
    console.log("sending");
    console.log(id);
    const res = await fetch(
      process.env.REACT_APP_BACKEND_URL +
        "spotify/removeAlbum?" +
        new URLSearchParams({
          id,
        }),
      {
        method: "delete",
        headers: {
          Authorization: props.token,
        },
      }
    );
    if (res.status == 200) {
      setSavedAlbums([...savedAlbums].filter((i) => i !== id));
      return true;
    } else {
      return false;
    }
  };

  const openModal = (e) => {
    document.body.style.overflow = "hidden";
    setShareInfo(e);
    setShowModal(true);
  };

  const closeModal = (e) => {
    document.body.style.overflow = "";
    setShowModal(false);
  };

  return (
    <div className="view">
      {showModal ? <Modal closeModal={closeModal} info={shareInfo} /> : null}
      <Header />
      <div className="dashboard">
        <SearchOptions
          searchSubmit={searchSubmit}
          loading={musicItemsLoading ? true : false}
        />
        <CardContainer
          musicItemsLoading={musicItemsLoading}
          musicItems={musicItems}
          openModal={openModal}
          type={searchOps.q}
          token={props.token}
          savedAlbums={savedAlbums}
          addSavedAlbum={addSavedAlbum}
          removeSavedAlbum={removeSavedAlbum}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
