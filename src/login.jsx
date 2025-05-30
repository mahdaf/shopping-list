import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (err) {
      setError("Your input is incorrect/the account does not exist.");
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form className="todo" onSubmit={handleLogin}>
        <div className="wrapper">
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={email}
            onInput={e => setEmail(e.target.value)}
            required
          />
          <label className="label">Email</label>
        </div>
        <div className="wrapper">
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onInput={e => setPassword(e.target.value)}
            required
          />
          <label className="label">Password</label>
        </div>
        <button className="btn" type="submit">Login</button>
      </form>
      {error && <p style={{color:"red"}}>{error}</p>}
      <p>
        Belum punya akun? <a href="#" onClick={onSwitchToRegister}>Daftar di sini</a>
      </p>
    </div>
  );
};

export default Login;