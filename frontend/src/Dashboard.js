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

  useEffect(() => {
    const redditGet = (q, t, sort) => {
      setMusicItemsLoading(true);
      console.log("token in props: " + props.token);
      console.log("calling");
      try {
        axios(
          "https://quiet-badlands-79645.herokuapp.com/search/getItems?" +
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
          console.log("called");
          setMusicItems(results.data.results);
          setMusicItemsLoading(false);
        });
      } catch (e) {
        console.log(e);
      }
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

  const openModal = (e) => {
    console.log(e);
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
        />
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
