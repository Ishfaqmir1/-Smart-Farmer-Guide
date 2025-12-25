import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setAuth] = useState(false);

  // AUTO LOGIN on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    axios.get("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setUser(res.data);
        setAuth(true);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
        setAuth(false);
      });
  }, []);


  // LOGIN FUNCTION (fix applied)
  const loginUser = async (data) => {
    const token = data.token;

    localStorage.setItem("token", token);

    try {
      const res = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setAuth(true);
    } catch (err) {
      setAuth(false);
    }
  };


  // LOGOUT
  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setAuth(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loginUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
