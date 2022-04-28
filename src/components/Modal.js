import "./Modal.css";

const Modal = (props) => {
  return (
    <div id="overlay">
      <div className="pop-up">
        <div className="header">LINK PLAYLIST TO SAVE SONGS</div>
        <ul className="list">
          {props.userPlaylists.map((i) => (
            <li>{i.name}</li>
          ))}
        </ul>
        <div className="buttons">
          <button className="create-button">Create New Playlist</button>
          <button className="close-button" onClick={props.closeModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
