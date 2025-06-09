import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/beranda"); // <-- diarahkan ke /beranda
    } catch {
      setError("Your input is incorrect or the account does not exist.");
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
            onInput={(e) => setEmail(e.target.value)}
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
            onInput={(e) => setPassword(e.target.value)}
            required
          />
          <label className="label">Password</label>
        </div>
        <button className="btn" type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        Belum punya akun? <Link to="/register">Daftar di sini</Link>
      </p>
    </div>
  );
};

export default Login;