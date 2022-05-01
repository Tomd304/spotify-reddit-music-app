import "./Modal.css";

const Modal = (props) => {
  const toggleClick = (uri) => {
    console.log("toggling");
    props.trackToggle(uri);
  };
  const saveSelected = async () => {
    let res = await fetch("http://localhost:5000/spotify/getPlaylists?");
    let json = await res.json();
    let id = null;
    const PLAYLIST_NAME = "FRESH_ALERTS";
    id = json.results.find((i) => i.name === PLAYLIST_NAME).id;
    id = id
      ? id
      : await fetch("http://localhost:5000/spotify/createPlaylist", {
          method: "put",
        }).json();
    // ADD TRACKS TO PLAYLIST
    res = await fetch(
      "http://localhost:5000/spotify/addPlaylistTracks?playlist_id=" +
        id +
        "&track_uris=" +
        props.selectedItems.join(","),
      { method: "put" }
    );
  };

  console.log(props.selectedItems);
  return (
    <div id="overlay">
      <div className="pop-up">
        <div className="header">LINK PLAYLIST TO SAVE SONGS</div>
        <ul className="list">
          {props.items.map((i) => {
            return props.selectedItems.includes(i.uri) ? (
              <li className="active-li" onClick={() => toggleClick(i.uri)}>
                {i.uri}
              </li>
            ) : (
              <li onClick={() => toggleClick(i.uri)}>{i.uri}</li>
            );
          })}
        </ul>
        <div className="buttons">
          <button className="create-button" onClick={saveSelected}>
            Add To Playlist
          </button>
          <button className="close-button" onClick={props.closeModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
