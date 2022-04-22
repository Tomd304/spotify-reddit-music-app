import "./Card.css";

const Card = (props) => {
  return (
    <div className="card">
      <img src={props.item.image} className="card-img" />
      <h1>{props.item.artist.name}</h1>
      <p>{props.item.name}</p>
    </div>
  );
};

export default Card;
