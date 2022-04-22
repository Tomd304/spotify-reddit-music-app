import "./Card.css";

const Card = (props) => {
  return (
    <div className="card">
      <a href={props.item.album.url}>
        <img src={props.item.image} className="card-img" />
      </a>
      <a href={props.item.artist.url}>
        <h1>{props.item.artist.name}</h1>
      </a>
      <a href={props.item.url}>
        <p>{props.item.name}</p>
      </a>
    </div>
  );
};

export default Card;
