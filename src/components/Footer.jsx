function Footer() {
  return (
    <footer className="footer">
      <p>
        🌾 <strong>Smart Farmer Guide</strong> — Empowering farmers with
        weather-driven decisions
      </p>

      <p>
        Built with <span className="heart">❤</span> using{" "}
        <strong>React</strong>, <strong>OpenWeather API</strong> &{" "}
        <strong>Data-Driven Advisory Logic</strong>
      </p>

      <p>
        👨‍💻 Developed by <strong>Ishfaq Mir</strong>
      </p>

      <p className="footer-small">
        © {new Date().getFullYear()} Smart Farmer Guide · All rights reserved
      </p>
    </footer>
  );
}

export default Footer;
