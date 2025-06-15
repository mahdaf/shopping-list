import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Register - Daftar Belanja";
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Akun berhasil dibuat! Silakan login.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <form className="todo" onSubmit={handleRegister}>
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
        <button className="btn" type="submit">Register</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        Sudah punya akun? <Link to="/login">Login di sini</Link>
      </p>
    </div>
  );
};

export default Register;