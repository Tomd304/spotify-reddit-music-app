import "./SearchOptions.css";

const SearchOptions = (props) => {
  return (
    <form className="form-container" onSubmit={props.searchSubmit}>
      <select disabled={props.loading} name="q" className="typeSelect">
        <option name="album" value="album">
          Albums
        </option>
        <option name="track" value="track">
          Tracks
        </option>
      </select>

      <select disabled={props.loading} className="sortSelect" name="sort">
        <option name="top" value="top">
          Top
        </option>
        <option name="hot" value="hot">
          Hot
        </option>
        <option name="relevance" value="relevance">
          Relevance
        </option>
        <option name="new" value="new">
          New
        </option>
      </select>
      <select disabled={props.loading} className="timeSelect" name="t">
        <option name="year" value="year">
          Year
        </option>
        <option name="month" value="month">
          Month
        </option>
        <option name="week" value="week">
          Week
        </option>
        <option name="day" value="day">
          Day
        </option>
        <option name="all" value="all">
          All
        </option>
      </select>
      {props.loading ? (
        <button disabled={props.loading}>Please wait</button>
      ) : (
        <button className="clickable">Search</button>
      )}
      {props.itemsSelected ? (
        <button
          disabled={props.loading}
          type="button"
          className="clickable"
          onClick={props.updateAlbums}
        >
          Add / Remove to Spotify Saved
        </button>
      ) : null}
    </form>
  );
};

export default SearchOptions;
