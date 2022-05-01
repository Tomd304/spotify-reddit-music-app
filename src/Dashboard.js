import React from "react";
import { useState, useEffect } from "react";
import Card from "./components/Card";
import SearchOptions from "./components/SearchOptions";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
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
  const [tracksSelected, setTracksSelected] = useState([]);
  const [showModal, setShowModal] = useState(false);

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
      setMusicItems(json.results);
      setMusicItemsLoading(false);
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
    setAlbumsSelected({ toSave: [], toRemove: [] });
  };

  const saveToggle = (id) => {
    if (albumsSelected.toSave.includes(id)) {
      setAlbumsSelected({
        ...albumsSelected,
        toSave: [...albumsSelected.toSave].filter((i) => i !== id),
      });
    } else {
      setAlbumsSelected({
        ...albumsSelected,
        toSave: [...albumsSelected.toSave, id],
      });
    }
  };

  const removeToggle = (id) => {
    if (albumsSelected.toRemove.includes(id)) {
      setAlbumsSelected({
        ...albumsSelected,
        toRemove: [...albumsSelected.toRemove].filter((i) => i !== id),
      });
    } else {
      setAlbumsSelected({
        ...albumsSelected,
        toRemove: [...albumsSelected.toRemove, id],
      });
    }
  };

  const trackToggle = (uri) => {
    console.log("toggling " + uri);
    if (tracksSelected.includes(uri)) {
      setTracksSelected([...tracksSelected].filter((i) => i !== uri));
    } else {
      setTracksSelected([...tracksSelected, uri]);
    }
  };

  const updateAlbums = async () => {
    let added;
    let removed;
    let newSaved = [...savedAlbums];
    if (albumsSelected.toSave.length > 0) {
      console.log("adding" + albumsSelected.toSave.length);
      added = await saveAlbums();
      newSaved = [...newSaved, ...added];
      console.log("removing" + albumsSelected.toRemove.length);
    }
    if (albumsSelected.toRemove.length > 0) {
      console.log("removing" + albumsSelected.toRemove.length);
      removed = await removeAlbums();
      newSaved = [...newSaved.filter((i) => !removed.includes(i))];
    }
    setSavedAlbums([...newSaved]);
    setAlbumsSelected({ toSave: [], toRemove: [] });
  };

  const saveAlbums = async () => {
    let ids = "";
    albumsSelected.toSave.forEach((i) => (ids += i + ","));
    ids.slice(ids.length, 1);
    const added = await fetch(
      "http://localhost:5000/spotify/saveAlbums?" +
        new URLSearchParams({
          ids,
        }),
      { method: "put" }
    );
    const itemsAdded = await added.json();
    return itemsAdded.added.split(",");
  };

  const removeAlbums = async () => {
    let ids = "";
    albumsSelected.toRemove.forEach((i) => (ids += i + ","));
    ids.slice(ids.length, 1);
    const removed = await fetch(
      "http://localhost:5000/spotify/removeAlbums?" +
        new URLSearchParams({
          ids,
        }),
      { method: "delete" }
    );
    const itemsRemoved = await removed.json();
    const removedArr = itemsRemoved.removed.split(",");
    return removedArr;
  };

  const openModal = async (e) => {
    e.preventDefault();
    document.body.style.overflow = "hidden";
    setShowModal(true);
  };

  const closeModal = async (e) => {
    e.preventDefault();
    document.body.style.overflow = "";
    setTracksSelected([]);
    setShowModal(false);
  };

  return (
    <div>
      {showModal ? (
        <Modal
          closeModal={closeModal}
          items={musicItems}
          selectedItems={tracksSelected}
          trackToggle={trackToggle}
        />
      ) : null}
      <div className="view">
        <Header />
        <div className="dashboard">
          <SearchOptions
            searchSubmit={searchSubmit}
            loading={albumLoading || musicItemsLoading ? true : false}
            updateAlbums={updateAlbums}
            itemsFound={musicItems.length > 0 ? true : false}
            showModal={openModal}
          />
          <ul className="card-container">
            {albumLoading || musicItemsLoading ? (
              <p>Loading...</p>
            ) : musicItems.length > 0 ? (
              musicItems.map((item) => {
                return (
                  <Card
                    item={item}
                    type={searchOps.q}
                    saveToggle={saveToggle}
                    removeToggle={removeToggle}
                    trackToggle={trackToggle}
                    toSave={
                      albumsSelected.toSave.includes(item.id) ? true : false
                    }
                    toRemove={
                      albumsSelected.toRemove.includes(item.id) ? true : false
                    }
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
    </div>
  );
};

export default Dashboard;
