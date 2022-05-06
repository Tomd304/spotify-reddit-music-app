import "./Card.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid, brands } from "@fortawesome/fontawesome-svg-core/import.macro"; // <-- import styles to be used
import { useState } from "react";

const Card = (props) => {
  const [flipped, setFlipped] = useState(false);
  const [disable, setDisable] = useState(false);
  const onClick = () => {
    if (!disable) {
      setFlipped(!flipped);
      setDisable(true);
      setTimeout(() => {
        setDisable(false);
      }, 200);
    }
  };
  return (
    <div className="card">
      {!flipped ? (
        <div className="card-front">
          <div className="options expand" onClick={onClick}>
            <FontAwesomeIcon icon={solid("ellipsis")} />
          </div>
          <a href={props.item.spotInfo.url} rel="noreferrer" target="_blank">
            <img src={props.item.spotInfo.image} className="card-img" />
          </a>
          <div className="icons">
            <p className="score">
              <FontAwesomeIcon icon={solid("arrow-up")} />
              {" " + props.item.redditInfo.score}
            </p>
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
      ) : (
        <div className="card-back">
          <div className="options minimise" onClick={onClick}>
            <FontAwesomeIcon icon={solid("rotate-left")} />
          </div>

          <img src={props.item.spotInfo.image} className="img-back" />
          <div className="text-links">
            <a href={props.item.spotInfo.artist.url} className="link-item">
              Artist <FontAwesomeIcon icon={brands("spotify")} />
            </a>
            <a href={props.item.spotInfo.url} className="link-item">
              Album <FontAwesomeIcon icon={brands("spotify")} />
            </a>
            <a href={props.item.redditInfo.url} className="link-item">
              Reddit <FontAwesomeIcon icon={brands("reddit")} />
            </a>
            <div className="link-item">
              Save <FontAwesomeIcon icon={solid("heart-circle-plus")} />
            </div>
            <div className="link-item">
              Share <FontAwesomeIcon icon={solid("share-nodes")} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
