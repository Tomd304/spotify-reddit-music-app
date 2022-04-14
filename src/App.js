import React, { useState, useEffect } from "react";
import WebPlayback from "./WebPlayback";
import Login from "./Login";
import "./App.css";

function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    async function getToken() {
      console.log("getting token");
      const response = await fetch("http://localhost:5000/auth/token");
      const json = await response.json();
      setToken(json.access_token);
    }

    getToken();
  }, []);
  console.log(token);
  return <>{token === "" ? <Login /> : <WebPlayback token={token} />}</>;
}

export default App;
