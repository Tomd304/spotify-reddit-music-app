import "./Card.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid, regular } from "@fortawesome/fontawesome-svg-core/import.macro"; // <-- import styles to be used

const HeartIcon = (props) => {
  return (
    <div>
      {props.saved && props.toRemove ? (
        <FontAwesomeIcon onClick={props.removeToggle} icon={regular("heart")} />
      ) : props.saved ? (
        <FontAwesomeIcon onClick={props.removeToggle} icon={solid("heart")} />
      ) : props.toSave ? (
        <FontAwesomeIcon
          onClick={props.saveToggle}
          className="accent"
          icon={solid("heart")}
        />
      ) : (
        <FontAwesomeIcon
          onClick={props.saveToggle}
          className="accent"
          icon={regular("heart")}
        />
      )}
    </div>
  );
};

export default HeartIcon;
