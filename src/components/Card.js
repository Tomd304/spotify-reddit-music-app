import "./Card.css";

const Card = (props) => {
  return (
    <div className="card">
      <a href={props.item.album.url}>
        <img src={props.item.image} className="card-img" />
      </a>
      <p className="score">&uarr;{props.item.score}</p>
      <a href={props.item.url}>
        <h1>{props.item.name}</h1>
      </a>
      <a className="artist" href={props.item.artist.url}>
        <p>{props.item.artist.name}</p>
      </a>
    </div>
  );
};

export default Card;
