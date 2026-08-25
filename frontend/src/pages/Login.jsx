import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      setMessage("Login successful! 🎉");

      setTimeout(() => {
        navigate("/");
      }, 800);

    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* BACKGROUND */}
      <div style={styles.background}></div>

      {/* OVERLAY */}
      <div style={styles.overlay}></div>

      {/* LOGIN CONTAINER */}
      <div style={styles.container}>

        {/* ================= LEFT ================= */}
        <div style={styles.left}>

          {/* LOGO */}
          <div style={styles.logoRow}>
            <div style={styles.logo}>H</div>

            <div>
              <h2 style={styles.logoText}>
                HireFlow <span style={styles.logoAI}>AI</span>
              </h2>

              <p style={styles.logoSub}>
                Smart Hiring. Better Careers.
              </p>
            </div>
          </div>

          <div style={styles.leftContent}>

            <div style={styles.badge}>
              ✨ AI-POWERED RECRUITMENT
            </div>

            <h1 style={styles.title}>
              Smarter Hiring.
              <br />
              <span style={styles.titleHighlight}>
                Better Careers.
              </span>
            </h1>

            <p style={styles.description}>
              HireFlow AI connects talented candidates
              with the right opportunities through
              intelligent recruitment technology.
            </p>

            <div style={styles.features}>

              <div style={styles.feature}>
                <div style={styles.featureIcon}>
                  🤖
                </div>

                <div>
                  <b style={styles.featureTitle}>
                    AI Resume Analysis
                  </b>

                  <small style={styles.featureText}>
                    Smart screening & matching
                  </small>
                </div>
              </div>

              <div style={styles.feature}>
                <div style={styles.featureIcon}>
                  🎯
                </div>

                <div>
                  <b style={styles.featureTitle}>
                    Smart Interviews
                  </b>

                  <small style={styles.featureText}>
                    AI-generated interview questions
                  </small>
                </div>
              </div>

              <div style={styles.feature}>
                <div style={styles.featureIcon}>
                  ⚡
                </div>

                <div>
                  <b style={styles.featureTitle}>
                    Faster Hiring
                  </b>

                  <small style={styles.featureText}>
                    Streamlined recruitment process
                  </small>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div style={styles.right}>

          <div style={styles.formCard}>

            <div style={styles.userIcon}>
              👤
            </div>

            <h2 style={styles.welcome}>
              Welcome Back!
            </h2>

            <p style={styles.subtitle}>
              Sign in to continue to your account
            </p>

            {/* MESSAGE */}
            {message && (
              <div
                style={{
                  ...styles.message,

                  background: message.includes("successful")
                    ? "rgba(34, 197, 94, 0.15)"
                    : "rgba(239, 68, 68, 0.15)",

                  color: message.includes("successful")
                    ? "#4ade80"
                    : "#fca5a5",

                  border: message.includes("successful")
                    ? "1px solid rgba(34, 197, 94, 0.35)"
                    : "1px solid rgba(239, 68, 68, 0.35)",
                }}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* EMAIL */}
              <label style={styles.label}>
                Email Address
              </label>

              <div style={styles.inputWrapper}>

                <span style={styles.inputIcon}>
                  ✉️
                </span>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />

              </div>

              {/* PASSWORD */}
              <label
                style={{
                  ...styles.label,
                  marginTop: "18px",
                }}
              >
                Password
              </label>

              <div style={styles.inputWrapper}>

                <span style={styles.inputIcon}>
                  🔒
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  style={styles.eyeButton}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>

              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.loginButton,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading
                  ? "Signing in..."
                  : "🔐 Sign In"}
              </button>

            </form>

            <div style={styles.security}>
              🔒 Your data is secure and protected
            </div>

          </div>

        </div>

      </div>

      <div style={styles.footer}>
        © 2026 HireFlow AI. All rights reserved.
      </div>

    </div>
  );
}


/* =====================================================
   DARK PURPLE THEME STYLES
===================================================== */

const styles = {

  page: {
    width: "100%",
    height: "100vh",
    minHeight: "100vh",

    position: "relative",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    overflow: "hidden",

    fontFamily:
      "'Segoe UI', Arial, sans-serif",

    background: "#24232a",
  },


  /* BACKGROUND */

  background: {
    position: "absolute",
    inset: 0,

    background:
      "linear-gradient(135deg, #24232a 0%, #2b2735 50%, #24232a 100%)",

    zIndex: 0,
  },


  /* PURPLE OVERLAY */

  overlay: {
    position: "absolute",
    inset: 0,

    background:
      "radial-gradient(circle at 20% 20%, rgba(139,92,246,0.15), transparent 35%), radial-gradient(circle at 80% 80%, rgba(168,85,247,0.12), transparent 40%)",

    zIndex: 1,
  },


  /* MAIN CONTAINER */

  container: {
    width: "min(1000px, calc(100% - 50px))",

    height: "min(590px, calc(100vh - 70px))",

    display: "grid",

    gridTemplateColumns:
      "1fr 0.9fr",

    borderRadius: "24px",

    overflow: "hidden",

    background: "#302e36",

    border:
      "1px solid #46414f",

    boxShadow:
      "0 30px 80px rgba(0,0,0,0.45)",

    position: "relative",

    zIndex: 2,
  },


  /* LEFT SIDE */

  left: {
    padding: "42px",

    color: "#f5f3ff",

    background:
      "linear-gradient(145deg, #302e36, #28252f)",

    boxSizing: "border-box",

    overflow: "hidden",

    borderRight:
      "1px solid #46414f",
  },


  logoRow: {
    display: "flex",

    alignItems: "center",

    gap: "12px",
  },


  logo: {
    width: "46px",

    height: "46px",

    borderRadius: "13px",

    background:
      "linear-gradient(135deg, #8b5cf6, #a855f7)",

    color: "#ffffff",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "24px",

    fontWeight: "800",

    boxShadow:
      "0 8px 25px rgba(139,92,246,0.35)",
  },


  logoText: {
    margin: 0,

    fontSize: "23px",

    fontWeight: "800",

    color: "#f5f3ff",
  },


  logoAI: {
    color: "#a78bfa",
  },


  logoSub: {
    margin: "2px 0 0",

    fontSize: "10px",

    color: "#a9a6b8",
  },


  leftContent: {
    marginTop: "85px",
  },


  badge: {
    display: "inline-block",

    padding: "7px 12px",

    borderRadius: "20px",

    background:
      "rgba(139,92,246,0.12)",

    border:
      "1px solid rgba(139,92,246,0.35)",

    color: "#c4b5fd",

    fontSize: "10px",

    letterSpacing: "0.5px",
  },


  title: {
    fontSize: "43px",

    lineHeight: "1.1",

    letterSpacing: "-1.5px",

    margin: "18px 0",

    fontWeight: "800",

    color: "#f5f3ff",
  },


  titleHighlight: {
    color: "#a78bfa",
  },


  description: {
    maxWidth: "430px",

    fontSize: "14px",

    lineHeight: "1.7",

    color: "#a9a6b8",
  },


  features: {
    marginTop: "28px",

    display: "flex",

    flexDirection: "column",

    gap: "14px",
  },


  feature: {
    display: "flex",

    alignItems: "center",

    gap: "12px",
  },


  featureIcon: {
    width: "38px",

    height: "38px",

    borderRadius: "10px",

    background: "#3a2e52",

    border:
      "1px solid rgba(139,92,246,0.25)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "17px",
  },


  featureTitle: {
    display: "block",

    color: "#f5f3ff",

    fontSize: "13px",
  },


  featureText: {
    display: "block",

    marginTop: "3px",

    color: "#a9a6b8",

    fontSize: "11px",
  },


  /* RIGHT SIDE */

  right: {
    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    padding: "40px",

    background: "#302e36",

    boxSizing: "border-box",
  },


  formCard: {
    width: "100%",

    maxWidth: "360px",

    color: "#f5f3ff",
  },


  userIcon: {
    width: "48px",

    height: "48px",

    borderRadius: "50%",

    background:
      "linear-gradient(135deg, #8b5cf6, #a855f7)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "21px",

    marginBottom: "14px",

    boxShadow:
      "0 8px 22px rgba(139,92,246,0.3)",
  },


  welcome: {
    fontSize: "28px",

    margin: "0",

    fontWeight: "800",

    color: "#f5f3ff",
  },


  subtitle: {
    marginTop: "6px",

    marginBottom: "24px",

    color: "#a9a6b8",

    fontSize: "13px",
  },


  message: {
    padding: "10px",

    borderRadius: "8px",

    marginBottom: "15px",

    fontSize: "12px",

    textAlign: "center",

    fontWeight: "600",
  },


  label: {
    display: "block",

    marginBottom: "7px",

    fontSize: "12px",

    fontWeight: "700",

    color: "#f5f3ff",
  },


  inputWrapper: {
    height: "48px",

    display: "flex",

    alignItems: "center",

    border:
      "1px solid #46414f",

    borderRadius: "10px",

    background: "#24232a",

    overflow: "hidden",
  },


  inputIcon: {
    paddingLeft: "13px",

    fontSize: "14px",
  },


  input: {
    flex: 1,

    minWidth: 0,

    height: "100%",

    border: "none",

    outline: "none",

    background: "transparent",

    padding: "0 10px",

    fontSize: "13px",

    color: "#f5f3ff",
  },


  eyeButton: {
    border: "none",

    background: "transparent",

    color: "#a9a6b8",

    cursor: "pointer",

    padding: "10px",

    fontSize: "14px",
  },


  loginButton: {
    width: "100%",

    height: "50px",

    marginTop: "25px",

    border: "none",

    borderRadius: "10px",

    background:
      "linear-gradient(135deg, #8b5cf6, #a855f7)",

    color: "#ffffff",

    fontSize: "14px",

    fontWeight: "700",

    cursor: "pointer",

    boxShadow:
      "0 10px 25px rgba(139,92,246,0.3)",
  },


  security: {
    textAlign: "center",

    marginTop: "20px",

    color: "#777383",

    fontSize: "10px",
  },


  footer: {
    position: "absolute",

    bottom: "8px",

    color: "#777383",

    fontSize: "10px",

    zIndex: 3,
  },
};

export default Login;