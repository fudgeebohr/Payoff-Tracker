import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? "register" : "login";

    try {
      const res = await fetch(`https://payofftrackerapi.onrender.com/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });

      const data = await res.json();

      if (res.ok) {
        if (isRegistering) {
          alert("Account created! You can now log in.");
          setIsRegistering(false);
        } else {
          localStorage.setItem("isLoggedIn", "true");
          onLogin();
        }
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert("Cannot connect to server. Ensure your Render API is awake.");
    }
  };

  return (
    <div className="login-wrapper" style={styles.wrapper}>
      {/* This container remains centered in the window */}
      <form onSubmit={handleSubmit} className="tracker-form" style={styles.form}>
        <div className="logo-container">
          <img src="https://iili.io/BgjZDb4.md.png" alt="Payoff Tracker Logo" className="sidebar-logo" />
        </div>
        
        <h2 style={styles.title}>
          {isRegistering ? "Create Account" : "Login"}
        </h2>

        {/* Labels are now placeholders to save space */}
        <input 
          type="text" 
          placeholder="Username"
          required
          value={credentials.username}
          onChange={e => setCredentials({...credentials, username: e.target.value})} 
        />

        <input 
          type="password" 
          placeholder="Password"
          required
          value={credentials.password}
          onChange={e => setCredentials({...credentials, password: e.target.value})} 
        />

        <button type="submit" className="add-record-btn">
          {isRegistering ? "Register" : "Sign In"}
        </button>

        <p style={styles.toggleText}>
          {isRegistering ? "Already have an account?" : "Need an account?"} 
          <span 
            onClick={() => setIsRegistering(!isRegistering)} 
            style={styles.toggleLink}
          >
            {isRegistering ? " Login here" : " Register here"}
          </span>
        </p>
      </form>
    </div>
  );
};

const styles = {
  // Flexbox ensures the form stays in the exact center of the screen
  wrapper: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh', 
    width: '100vw', 
    background: '#fdf5e6',
    boxSizing: 'border-box'
  },
  form: { 
    display: 'flex',
    flexDirection: 'column',
    gap: '15px', // Adds consistent spacing between placeholder inputs
    maxWidth: '400px', 
    width: '90%', 
    padding: '40px', 
    background: 'white', 
    borderRadius: '8px', 
    border: '1px solid #d3b8d3', 
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    boxSizing: 'border-box'
  },
  title: { 
    color: '#9b6d9b', 
    textAlign: 'center', 
    fontFamily: 'Century Gothic, sans-serif', 
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  toggleText: { 
    fontFamily: 'Century Gothic, sans-serif', 
    fontSize: '0.85rem', 
    textAlign: 'center', 
    marginTop: '20px',
    color: '#5a4a5a'
  },
  toggleLink: { 
    color: '#9b6d9b', 
    cursor: 'pointer', 
    fontWeight: 'bold', 
    textDecoration: 'underline',
    marginLeft: '5px'
  }
};

export default Login;