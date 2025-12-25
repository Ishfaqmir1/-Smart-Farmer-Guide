import { useState } from "react";
import "../App.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      setMsg("Registration Successful 🎉 Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed ❌");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleRegister} className="auth-card">
        <h2>📝 Create Account</h2>

        <div className="field">
          <input
            type="text"
            required
            placeholder=" "
            onChange={(e) => setName(e.target.value)}
          />
          <label>Full Name</label>
        </div>

        <div className="field">
          <input
            type="email"
            required
            placeholder=" "
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email Address</label>
        </div>

        <div className="field">
          <input
            type="password"
            required
            placeholder=" "
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>
        </div>

        <button type="submit" className="btn-primary">
          Register
        </button>

        {msg && <p className="msg">{msg}</p>}

        <p className="switch-text">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
