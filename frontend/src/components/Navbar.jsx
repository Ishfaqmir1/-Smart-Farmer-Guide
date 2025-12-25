import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../App.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logoutUser, isAuthenticated } = useContext(AuthContext);

  const [openMenu, setOpenMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const profileRef = useRef(null);
  const mobileRef = useRef(null);

  /* =========================
     CLOSE MENUS ON OUTSIDE CLICK
  ========================= */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* =========================
     SCROLLSPY (HOME PAGE ONLY)
  ========================= */
  useEffect(() => {
    if (location.pathname !== "/") return;

    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [location.pathname]);

  /* =========================
     SCROLL HANDLER
  ========================= */
  const scrollToSection = (id) => {
    setMobileOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 250);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar">
      {/* LOGO */}
      <div className="nav-logo">
        <Link to="/">🌾 SmartFarmer</Link>
      </div>

      {/* DESKTOP LINKS */}
      <ul className="nav-links">
        <li>
          <button
            className={activeSection === "hero" ? "active" : ""}
            onClick={() => scrollToSection("hero")}
          >
            Home
          </button>
        </li>

        <li>
          <Link
            to="/services"
            className={location.pathname === "/services" ? "active" : ""}
          >
            Services
          </Link>
        </li>

        <li>
          <button
            className={activeSection === "contact" ? "active" : ""}
            onClick={() => scrollToSection("contact")}
          >
            Contact
          </button>
        </li>
      </ul>

      {/* AUTH / PROFILE */}
      {!isAuthenticated ? (
        <div className="nav-auth">
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Register</button>
        </div>
      ) : (
        <div className="nav-profile-container" ref={profileRef}>
          <span className="avatar" onClick={() => setOpenMenu(!openMenu)}>
            👤 {user?.name}
          </span>

          {openMenu && (
            <div className="profile-menu">
              <p><strong>{user?.name}</strong></p>
              <p>{user?.email}</p>
              <Link to="/profile">View Profile</Link>
              <button onClick={logoutUser}>Logout</button>
            </div>
          )}
        </div>
      )}

      {/* HAMBURGER */}
      <div
        className={`hamburger ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span />
        <span />
        <span />
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="mobile-menu" ref={mobileRef}>
          <button onClick={() => scrollToSection("hero")}>Home</button>

          <Link to="/services" onClick={() => setMobileOpen(false)}>
            Services
          </Link>

          <button onClick={() => scrollToSection("contact")}>
            Contact
          </button>

          {!isAuthenticated && (
            <>
              <button onClick={() => navigate("/login")}>Login</button>
              <button
                className="register-btn"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
