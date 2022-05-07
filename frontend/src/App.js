import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import "./App.css";
import axios from "axios";
import { Credentials } from "./Credentials";
import qs from "query-string";
import { faQuoteLeftAlt } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [token, setToken] = useState("");
  const spotify = Credentials();
  console.log(spotify);
  useEffect(() => {
    const callToken = async () => {
      try {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let urlToken = "";
        if (urlParams.has("code")) {
          urlToken = urlParams.get("code");
          setToken("Bearer " + urlToken);
          window.history.pushState({}, document.title, "/");
        }
        if (token == "" && urlToken == "") {
          window.location.replace("http://localhost:5000/auth/login");
        }
      } catch (e) {
        console.log(e);
      }
    };
    callToken();
  }, [spotify.ClientId, spotify.ClientSecret]);

  return <>{token !== "" ? <Dashboard token={token} /> : null}</>;
}

export default App;
