import React, { useState } from "react";
import { toast } from "react-toastify";
import { loginUser } from "../../api";
import "../stylesheets/Login.css";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const request = await loginUser({ email, password });
      const response = request.data;

      if (response.success) {
        toast.success("Login Successful 🎉");
        navigate("/all-rooms");
      }

      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>

        {/* 🔗 Register Link */}
        <p className="register-text">
          Don’t have an account?{" "}
          <Link to="/">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
