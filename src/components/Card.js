import "./Card.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid, regular } from "@fortawesome/fontawesome-svg-core/import.macro"; // <-- import styles to be used

const Card = (props) => {
  return (
    <div className="card">
      <a href={props.item.url} rel="noreferrer" target="_blank">
        <img src={props.item.image} className="card-img" />
      </a>
      <div className="icons">
        {props.saved ? (
          <FontAwesomeIcon icon={solid("heart")} />
        ) : (
          <FontAwesomeIcon icon={regular("heart")} />
        )}

        <p className="score">
          <FontAwesomeIcon icon={solid("arrow-up")} />
          {" " + props.item.score}
        </p>
        <a href={props.item.redditURL} rel="noreferrer" target="_blank">
          <FontAwesomeIcon icon={regular("message")} />
        </a>
      </div>
      <a href={props.item.url} rel="noreferrer" target="_blank">
        <h1>{props.item.name}</h1>
      </a>
      <a
        className="artist"
        href={props.item.artist.url}
        rel="noreferrer"
        target="_blank"
      >
        <p>{props.item.artist.name}</p>
      </a>
    </div>
  );
};

export default Card;
