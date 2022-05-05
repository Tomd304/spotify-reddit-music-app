import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import "./App.css";
import axios from "axios";
import { Credentials } from "./Credentials";

function App() {
  const [token, setToken] = useState("");
  const spotify = Credentials();
  useEffect(() => {
    console.log("getting token");
    console.log("id: " + process.env.REACT_APP_CLIENT_ID);
    console.log("secret: " + process.env.REACT_APP_CLIENT_SECRET);

    const callToken = async () => {
      try {
        const tokenResponse = await axios(
          "https://accounts.spotify.com/api/token",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization:
                "Basic " +
                btoa(
                  process.env.REACT_APP_CLIENT_ID +
                    ":" +
                    process.env.REACT_APP_CLIENT_SECRET
                ),
            },
            data: "grant_type=client_credentials",
            method: "POST",
          }
        );
        console.log(tokenResponse);
        setToken("Bearer " + tokenResponse.data.access_token);
        console.log("token set : " + token);
      } catch (e) {
        console.log(e);
      }
    };
    callToken();
  }, [spotify.ClientId, spotify.ClientSecret]);

  return <>{token !== "" ? <Dashboard token={token} /> : null}</>;
}

export default App;
