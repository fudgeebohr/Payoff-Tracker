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
          alert("Account created! Please log in.");
          setIsRegistering(false);
        } else {
          localStorage.setItem("isLoggedIn", "true");
          onLogin();
        }
      } else {
        alert(data.message || "Authentication failed");
      }
    } catch (err) {
      alert("Server error. Ensure your Render API is awake.");
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit} className="tracker-form login-card">
        <h2 className="login-title">{isRegistering ? "Create Account" : "Login"}</h2>
        
        {/* Placeholders replace labels to save space */}
        <input 
          type="text" 
          placeholder="Username" 
          required
          onChange={e => setCredentials({...credentials, username: e.target.value})} 
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          required
          onChange={e => setCredentials({...credentials, password: e.target.value})} 
        />
        
        <button type="submit" className="add-record-btn">
          {isRegistering ? "Register" : "Sign In"}
        </button>

        <p className="toggle-text">
          {isRegistering ? "Already have an account?" : "Need an account?"} 
          <span onClick={() => setIsRegistering(!isRegistering)} className="toggle-link">
            {isRegistering ? " Login here" : " Register here"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;