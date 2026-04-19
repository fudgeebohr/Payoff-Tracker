import React, { useState } from "react";
import Tracker from "./components/Tracker";
import Login from "./components/Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return <Tracker />;
}

export default App;