import "./Modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid, regular } from "@fortawesome/fontawesome-svg-core/import.macro"; // <-- import styles to be used
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

const Modal = (props) => {
  const iconSize = 40;
  const copy = () => {
    navigator.clipboard.writeText(props.info.url);
    props.closeModal();
  };
  return (
    <div id="overlay">
      <div className="pop-up">
        <div className="close-button">
          <FontAwesomeIcon
            onClick={props.closeModal}
            style={{ cursor: "pointer" }}
            icon={solid("xmark")}
          />
        </div>
        <div className="share-icons">
          <EmailShareButton
            url={props.info.url}
            subject="New Music"
            body=""
            onClick={props.closeModal}
          >
            <EmailIcon round={true} size={iconSize} />
          </EmailShareButton>
          <FacebookShareButton url={props.info.url} onClick={props.closeModal}>
            <FacebookIcon round={true} size={iconSize} />
          </FacebookShareButton>
          <TelegramShareButton url={props.info.url} onClick={props.closeModal}>
            <TelegramIcon round={true} size={iconSize} />
          </TelegramShareButton>
          <TwitterShareButton url={props.info.url} onClick={props.closeModal}>
            <TwitterIcon round={true} size={iconSize} />
          </TwitterShareButton>
          <WhatsappShareButton url={props.info.url} onClick={props.closeModal}>
            <WhatsappIcon round={true} size={iconSize} />
          </WhatsappShareButton>
          <FontAwesomeIcon
            onClick={copy}
            className="copy-button"
            icon={solid("copy")}
            size={iconSize}
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
