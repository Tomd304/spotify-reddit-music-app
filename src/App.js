import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const getToken = async () => {
      console.log("getting token");
      const response = await fetch("http://localhost:5000/auth/token");
      const json = await response.json();
      setToken(json.access_token);
    };

    getToken();
  }, []);
  console.log(token);
  return (
    <>
      {token === "" ? (
        <Login />
      ) : (
        <div>
          <Dashboard token={token} />
        </div>
      )}
    </>
  );
}

export default App;
