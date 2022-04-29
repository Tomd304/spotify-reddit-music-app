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
  const [itemsToSave, setItemsToSave] = useState([]);
  useEffect(() => {
    const getSavedAlbums = async () => {
      console.log("getting saved");
      const res = await fetch("http://localhost:5000/spotify/getSavedAlbums");
      const json = await res.json();
      setSavedAlbums(json.results);
    };
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
    setItemsToSave([]);
  };

  const saveToggle = (id) => {
    if (itemsToSave.includes(id)) {
      setItemsToSave([...itemsToSave].filter((i) => i !== id));
    } else {
      console.log(itemsToSave.length);
      console.log("saving");
      console.log(itemsToSave.length);
      setItemsToSave([...itemsToSave, id]);
    }
  };

  const saveAlbums = async () => {
    console.log("saving albums");
    let ids = "";
    itemsToSave.forEach((i) => (ids += i + ","));
    ids.slice(ids.length, 1);
    const added = await fetch(
      "http://localhost:5000/spotify/saveAlbums?" +
        new URLSearchParams({
          ids,
        }),
      { method: "put" }
    );
    console.log(added);
    const itemsAdded = await added.json();
    console.log(itemsAdded);
    setSavedAlbums([...savedAlbums, ...itemsAdded.added.split(",")]);
    setItemsToSave([]);
  };

  return (
    <div className="view">
      <Header />
      <div className="dashboard">
        <SearchOptions
          searchSubmit={searchSubmit}
          loading={loading}
          itemsSelected={itemsToSave.length > 0 ? true : false}
          saveItems={saveAlbums}
        />
        <ul className="card-container">
          {loading ? (
            <p>Loading...</p>
          ) : musicItems.length > 0 ? (
            musicItems.map((item) => {
              return (
                <Card
                  item={item}
                  saveToggle={saveToggle}
                  toSave={itemsToSave.includes(item.id) ? true : false}
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
