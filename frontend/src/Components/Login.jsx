import React, { useState } from "react";
import { LoginUser } from "../../api";
import { toast } from "react-toastify";
import "../stylesheets/Login.css";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email) return toast.error("Email is required");
    if (!password) return toast.error("Password is required");

    try {
      const request = await LoginUser({ email, password });
      const response = request.data;

      toast.success("Login successful 🎉");
      if (response.success) {
        localStorage.setItem("token", response.token)
        navigate("/home");
      }

      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed ❌");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p>Login to manage your bookings</p>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        {/* Register Option */}
        <p className="register-text">
          Don't have an account?{" "}
          <Link to="/" className="register-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
