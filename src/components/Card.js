import "./Card.css";

const Card = (props) => {
  return (
    <div className="card">
      <img src={props.item.image} className="card-img" />
      <h1>{props.item.artist}</h1>
      <p>{props.item.name}</p>
    </div>
  );
};

export default Card;
