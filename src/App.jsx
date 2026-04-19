import React, { useState } from "react";
import Tracker from "./components/Tracker";
import Login from "./components/Login";

function App() {
  // Check localStorage so the user stays logged in even if they refresh the page
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  // If not logged in, show only the Login/Register screen
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  // If logged in, show the Tracker and pass the logout function
  return <Tracker onLogout={() => setIsLoggedIn(false)} />;
}

export default App;