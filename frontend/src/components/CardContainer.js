import "./CardContainer.css";
import Card from "./Card";

const CardContainer = (props) => {
  return (
    <ul className="card-container">
      {props.musicItemsLoading ? (
        <p>Loading...</p>
      ) : props.musicItems.length > 0 ? (
        props.musicItems.map((item) => {
          return <Card item={item} openModal={props.openModal} />;
        })
      ) : (
        <p>No Results</p>
      )}
    </ul>
  );
};

export default CardContainer;
