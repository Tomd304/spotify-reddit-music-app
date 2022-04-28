import "./PlaylistLink.css";

const PlaylistLink = (props) => {
  return (
    <div className="playlist-container">
      <button onClick={props.onClick} className="clickable playlist-btn">
        LINK PLAYLIST
      </button>
    </div>
  );
};

export default PlaylistLink;
