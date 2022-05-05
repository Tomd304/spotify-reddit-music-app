import "./Card.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid, regular } from "@fortawesome/fontawesome-svg-core/import.macro"; // <-- import styles to be used

const Card = (props) => {
  return (
    <div className="card">
      <a href={props.item.spotInfo.url} rel="noreferrer" target="_blank">
        <img src={props.item.spotInfo.image} className="card-img" />
      </a>
      <div className="icons">
        <p className="score">
          <FontAwesomeIcon icon={solid("arrow-up")} />
          {" " + props.item.redditInfo.score}
        </p>
        <a href={props.item.redditInfo.url} rel="noreferrer" target="_blank">
          <FontAwesomeIcon icon={regular("message")} />
        </a>
      </div>
      <a href={props.item.spotInfo.url} rel="noreferrer" target="_blank">
        <h1>{props.item.spotInfo.name}</h1>
      </a>
      <a
        className="artist"
        href={props.item.spotInfo.artist.url}
        rel="noreferrer"
        target="_blank"
      >
        <p>{props.item.spotInfo.artist.name}</p>
      </a>
    </div>
  );
};

export default Card;
