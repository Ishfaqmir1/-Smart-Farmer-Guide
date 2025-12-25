import { useState, useContext } from "react";
import "../App.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      // Update global auth context
      await loginUser(res.data);

      setMsg("Login Successful 🎉");

      setTimeout(() => {
        navigate("/");
      }, 800);

    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed ❌");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-card">

        <h2>🔐 Login</h2>

        <input
          type="email"
          placeholder="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="btn-primary">Login</button>

        {msg && <p className="msg">{msg}</p>}

        <p className="switch-text">
          Don’t have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
