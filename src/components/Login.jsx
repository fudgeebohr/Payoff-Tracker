import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("https://payofftrackerapi.onrender.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)
    });
    if (res.ok) {
      localStorage.setItem("isLoggedIn", "true");
      onLogin();
    } else {
      alert("Login Failed");
    }
  };

  return (
    <div className="login-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#fdf5e6' }}>
      <form onSubmit={handleLogin} className="tracker-form" style={{ width: '300px', padding: '40px', background: 'white', borderRadius: '8px', border: '1px solid #d3b8d3' }}>
        <div className="logo-container">
          <img src="./logo.png" alt="Payoff Tracker Logo" className="sidebar-logo" />
        </div>
        <label>Username</label>
        <input type="text" onChange={e => setCredentials({...credentials, username: e.target.value})} />
        <label>Password</label>
        <input type="password" onChange={e => setCredentials({...credentials, password: e.target.value})} />
        <button type="submit" className="add-record-btn">Sign In</button>
      </form>
    </div>
  );
};

export default Login;