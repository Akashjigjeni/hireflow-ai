import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.errorCode}>404</div>

          <div style={styles.icon}>🔍</div>

          <h1 style={styles.title}>Page Not Found</h1>

          <p style={styles.subtitle}>
            Oops! The page you are looking for doesn't exist or may have been moved.
          </p>

          <button
            style={styles.button}
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#24232A",
    color: "#F5F3FF",
    fontFamily: "system-ui, 'Segoe UI', Roboto, Arial, sans-serif",
  },

  container: {
    minHeight: "calc(100vh - 70px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },

  card: {
    width: "100%",
    maxWidth: "600px",
    textAlign: "center",
    background: "#302E36",
    border: "1px solid #46414F",
    borderRadius: "22px",
    padding: "55px 35px",
    boxShadow: "0 12px 35px rgba(0,0,0,0.25)",
  },

  errorCode: {
    fontSize: "90px",
    fontWeight: "900",
    lineHeight: "1",
    marginBottom: "18px",
    background: "linear-gradient(135deg, #8B5CF6, #A855F7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  icon: {
    width: "65px",
    height: "65px",
    margin: "0 auto 20px",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#3A2E52",
    border: "1px solid #6D4BC4",
    fontSize: "30px",
  },

  title: {
    margin: "0 0 12px",
    color: "#F5F3FF",
    fontSize: "30px",
    fontWeight: "800",
  },

  subtitle: {
    maxWidth: "430px",
    margin: "0 auto 30px",
    color: "#A9A6B8",
    fontSize: "15px",
    lineHeight: "1.7",
  },

  button: {
    border: "none",
    borderRadius: "10px",
    padding: "13px 24px",
    background: "linear-gradient(135deg, #8B5CF6, #A855F7)",
    color: "#FFFFFF",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(139,92,246,0.25)",
  },
};

export default NotFound;