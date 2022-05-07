import "./Card.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid, brands } from "@fortawesome/fontawesome-svg-core/import.macro"; // <-- import styles to be used
import { useState } from "react";
import {
  EmailShareButton,
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

import {
  EmailIcon,
  FacebookIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

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
      <a href={props.item.spotInfo.url} rel="noreferrer" target="_blank">
        <img src={props.item.spotInfo.image} className="card-img" />
      </a>
      <div className="info">
        <p className="score">
          <FontAwesomeIcon icon={solid("arrow-up")} />
          {" " + props.item.redditInfo.score}
        </p>

        <a
          className="item"
          href={props.item.spotInfo.url}
          rel="noreferrer"
          target="_blank"
        >
          {props.item.spotInfo.name}
        </a>
        <a
          className="artist"
          href={props.item.spotInfo.artist.url}
          rel="noreferrer"
          target="_blank"
        >
          {props.item.spotInfo.artist.name}
        </a>
      </div>

      <div className="text-links">
        <a
          href={props.item.spotInfo.url}
          style={{ color: "rgb(30 215 96)" }}
          className="link-item"
        >
          <FontAwesomeIcon icon={brands("spotify")} />
        </a>
        <div style={{ color: " rgb(255, 88, 88)" }} className="link-item">
          <FontAwesomeIcon icon={solid("heart-circle-plus")} />
        </div>{" "}
        <a
          style={{ color: "rgb(212, 212, 212)" }}
          href={props.item.redditInfo.url}
          className="link-item"
        >
          <FontAwesomeIcon icon={brands("reddit-alien")} />
        </a>
        <div style={{ color: "aliceblue" }} className="link-item">
          <FontAwesomeIcon icon={solid("share-nodes")} />
        </div>
      </div>
    </div>
  );
};

export default Card;
