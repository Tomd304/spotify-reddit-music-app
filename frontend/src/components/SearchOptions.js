import "./SearchOptions.css";
import { useState } from "react";

const SearchOptions = (props) => {
  const [disable, setDisable] = useState(false);
  const onChange = (e) => {
    if (e.target.value !== "top") {
      setDisable(true);
    } else {
      setDisable(false);
    }
  };
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

      <select
        disabled={props.loading}
        onChange={onChange}
        className="sortSelect"
        name="sort"
      >
        <option name="top" value="top">
          Top
        </option>
        <option name="hot" value="hot">
          Hot
        </option>
        <option name="new" value="new">
          New
        </option>
      </select>
      {disable ? (
        <select disabled={true} className={"disabled"} name="t">
          <option name="year" value="year">
            N/A
          </option>{" "}
        </select>
      ) : (
        <select
          disabled={disable || props.loading}
          className={disable ? "disabled " : "" + "timeSelect"}
          name="t"
        >
          <option name="year" value="year">
            Year
          </option>
          <option name="month" value="month">
            Month
          </option>
          <option selected="selected" name="week" value="week">
            Week
          </option>
          <option name="day" value="day">
            Day
          </option>
          <option name="all" value="all">
            All
          </option>
        </select>
      )}

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
