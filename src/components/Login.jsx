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
          alert("Registration successful! Please log in.");
          setIsRegistering(false); // Switch to login mode
        } else {
          localStorage.setItem("isLoggedIn", "true");
          onLogin();
        }
      } else {
        alert(data.message || "Action failed");
      }
    } catch (err) {
      alert("Server error. Please check Render logs.");
    }
  };

  return (
    <div className="login-wrapper" style={styles.wrapper}>
      <form onSubmit={handleSubmit} className="tracker-form" style={styles.form}>
        <div className="logo-container">
          <img src="./logo.png" alt="Payoff Tracker Logo" className="sidebar-logo" />
        </div>
        <h2 style={{ color: '#9b6d9b', textAlign: 'center', fontFamily: 'century gothic', fontWeight: 'bold' }}>
          {isRegistering ? "Create Account" : "Login"}
        </h2>
        
        <label>Username</label>
        <input 
          type="text" 
          required
          onChange={e => setCredentials({...credentials, username: e.target.value})} 
        />
        
        <label>Password</label>
        <input 
          type="password" 
          required
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
  wrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#fdf5e6' },
  form: { width: '320px', padding: '40px', background: 'white', borderRadius: '8px', border: '1px solid #d3b8d3', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
  toggleText: { fontSize: '0.85rem', textAlign: 'center', marginTop: '20px' },
  toggleLink: { color: '#9b6d9b', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }
};

export default Login;