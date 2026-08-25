import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
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
      const res = await API.post("/auth/register", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      setMessage("Registration Successful! 🎉");

      setTimeout(() => {
        if (res.data.user.role === "employer") {
          navigate("/employer-dashboard");
        } else {
          navigate("/candidate-dashboard");
        }
      }, 800);
    } catch (err) {
      console.error(err);

      setMessage(
        err.response?.data?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Background */}
      <div style={styles.background}></div>

      {/* Main Container */}
      <div style={styles.container}>

        {/* LEFT SIDE */}
        <div style={styles.left}>
          <div style={styles.logoRow}>
            <div style={styles.logo}>H</div>

            <div>
              <h2 style={styles.logoText}>
                HireFlow <span style={{ color: "#A855F7" }}>AI</span>
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
              Start Your
              <br />
              <span style={styles.gradientText}>
                Career Journey.
              </span>
            </h1>

            <p style={styles.description}>
              Join HireFlow AI and discover smarter
              opportunities or find the perfect talent
              for your organization.
            </p>

            <div style={styles.features}>

              <div style={styles.feature}>
                <div style={styles.featureIcon}>👤</div>

                <div>
                  <b style={styles.featureTitle}>
                    For Candidates
                  </b>

                  <small style={styles.featureText}>
                    Discover your dream job
                  </small>
                </div>
              </div>

              <div style={styles.feature}>
                <div style={styles.featureIcon}>🏢</div>

                <div>
                  <b style={styles.featureTitle}>
                    For Employers
                  </b>

                  <small style={styles.featureText}>
                    Find the right talent
                  </small>
                </div>
              </div>

              <div style={styles.feature}>
                <div style={styles.featureIcon}>🤖</div>

                <div>
                  <b style={styles.featureTitle}>
                    AI-Powered Hiring
                  </b>

                  <small style={styles.featureText}>
                    Faster and smarter recruitment
                  </small>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div style={styles.right}>
          <div style={styles.formCard}>

            <div style={styles.userIcon}>✨</div>

            <h2 style={styles.welcome}>
              Create Account
            </h2>

            <p style={styles.subtitle}>
              Join HireFlow AI today
            </p>

            {message && (
              <div
                style={{
                  ...styles.message,
                  background: message.includes("Successful")
                    ? "rgba(34, 197, 94, 0.12)"
                    : "rgba(239, 68, 68, 0.12)",
                  border: message.includes("Successful")
                    ? "1px solid rgba(34, 197, 94, 0.35)"
                    : "1px solid rgba(239, 68, 68, 0.35)",
                  color: message.includes("Successful")
                    ? "#4ADE80"
                    : "#FCA5A5",
                }}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* NAME */}
              <label style={styles.label}>
                Full Name
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>👤</span>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              {/* EMAIL */}
              <label
                style={{
                  ...styles.label,
                  marginTop: "14px",
                }}
              >
                Email Address
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>✉️</span>

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
                  marginTop: "14px",
                }}
              >
                Password
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>🔒</span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Create a password"
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

              {/* ACCOUNT TYPE */}
              <label
                style={{
                  ...styles.label,
                  marginTop: "14px",
                }}
              >
                Account Type
              </label>

              <div style={styles.roleContainer}>

                <label
                  style={{
                    ...styles.roleOption,

                    border:
                      formData.role === "candidate"
                        ? "2px solid #8B5CF6"
                        : "1px solid #46414F",

                    background:
                      formData.role === "candidate"
                        ? "#3A2E52"
                        : "#302E36",
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value="candidate"
                    checked={
                      formData.role === "candidate"
                    }
                    onChange={handleChange}
                  />

                  <span>👤 Candidate</span>
                </label>

                <label
                  style={{
                    ...styles.roleOption,

                    border:
                      formData.role === "employer"
                        ? "2px solid #A855F7"
                        : "1px solid #46414F",

                    background:
                      formData.role === "employer"
                        ? "#3A2E52"
                        : "#302E36",
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value="employer"
                    checked={
                      formData.role === "employer"
                    }
                    onChange={handleChange}
                  />

                  <span>🏢 Employer</span>
                </label>

              </div>

              {/* CREATE BUTTON */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.registerButton,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading
                  ? "Creating Account..."
                  : "🚀 Create Account"}
              </button>

            </form>

            {/* LOGIN */}
            <p style={styles.loginText}>
              Already have an account?{" "}

              <span
                onClick={() => navigate("/login")}
                style={styles.loginLink}
              >
                Sign In
              </span>
            </p>

            <div style={styles.security}>
              🔒 Your information is secure and protected
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

/* =========================
   STYLES
========================= */

const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    background: "#24232A",
    fontFamily: "system-ui, Segoe UI, Arial, sans-serif",
  },

  background: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at 15% 20%, rgba(139,92,246,0.18), transparent 30%), radial-gradient(circle at 85% 80%, rgba(168,85,247,0.15), transparent 30%), #24232A",
    zIndex: 0,
  },

  container: {
    width: "min(1000px, calc(100% - 40px))",
    minHeight: "620px",
    display: "grid",
    gridTemplateColumns: "1fr 0.9fr",
    borderRadius: "24px",
    overflow: "hidden",
    background: "#302E36",
    border: "1px solid #46414F",
    boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
    position: "relative",
    zIndex: 2,
  },

  left: {
    padding: "42px",
    color: "#F5F3FF",
    background:
      "linear-gradient(145deg, #2B2733 0%, #352846 55%, #302E36 100%)",
    boxSizing: "border-box",
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
      "linear-gradient(135deg, #8B5CF6, #A855F7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFF",
    fontSize: "24px",
    fontWeight: "800",
    boxShadow: "0 8px 25px rgba(139,92,246,0.35)",
  },

  logoText: {
    margin: 0,
    color: "#F5F3FF",
    fontSize: "23px",
    fontWeight: "800",
  },

  logoSub: {
    margin: "2px 0 0",
    fontSize: "10px",
    color: "#A9A6B8",
  },

  leftContent: {
    marginTop: "45px",
  },

  badge: {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: "20px",
    background: "rgba(139,92,246,0.14)",
    border: "1px solid rgba(167,139,250,0.28)",
    color: "#C4B5FD",
    fontSize: "10px",
    letterSpacing: "0.5px",
    fontWeight: "700",
  },

  title: {
    fontSize: "38px",
    lineHeight: "1.1",
    letterSpacing: "-1.5px",
    margin: "18px 0",
    fontWeight: "800",
    color: "#F5F3FF",
  },

  gradientText: {
    color: "#A78BFA",
  },

  description: {
    maxWidth: "430px",
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#A9A6B8",
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
    width: "40px",
    height: "40px",
    borderRadius: "11px",
    background: "#3A2E52",
    border: "1px solid #4C3A68",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    flexShrink: 0,
  },

  featureTitle: {
    display: "block",
    color: "#F5F3FF",
    fontSize: "13px",
  },

  featureText: {
    display: "block",
    marginTop: "2px",
    color: "#A9A6B8",
    fontSize: "11px",
  },

  right: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "35px",
    background: "#302E36",
    boxSizing: "border-box",
  },

  formCard: {
    width: "100%",
    maxWidth: "370px",
    color: "#F5F3FF",
  },

  userIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #8B5CF6, #A855F7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    marginBottom: "12px",
    boxShadow: "0 8px 20px rgba(139,92,246,0.25)",
  },

  welcome: {
    fontSize: "28px",
    margin: 0,
    fontWeight: "800",
    color: "#F5F3FF",
  },

  subtitle: {
    marginTop: "5px",
    marginBottom: "20px",
    color: "#A9A6B8",
    fontSize: "13px",
  },

  message: {
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "14px",
    fontSize: "12px",
    textAlign: "center",
    fontWeight: "600",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#D8D5E3",
  },

  inputWrapper: {
    height: "46px",
    display: "flex",
    alignItems: "center",
    border: "1px solid #46414F",
    borderRadius: "9px",
    background: "#24232A",
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
    color: "#F5F3FF",
  },

  eyeButton: {
    border: "none",
    background: "transparent",
    color: "#A9A6B8",
    cursor: "pointer",
    padding: "10px",
    fontSize: "13px",
  },

  roleContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },

  roleOption: {
    minHeight: "44px",
    padding: "8px",
    borderRadius: "9px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#F5F3FF",
    boxSizing: "border-box",
  },

  registerButton: {
    width: "100%",
    height: "48px",
    marginTop: "18px",
    border: "none",
    borderRadius: "9px",
    background:
      "linear-gradient(135deg, #8B5CF6, #A855F7)",
    color: "#FFFFFF",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow:
      "0 10px 25px rgba(139,92,246,0.28)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  loginText: {
    textAlign: "center",
    marginTop: "16px",
    fontSize: "12px",
    color: "#A9A6B8",
  },

  loginLink: {
    color: "#C4B5FD",
    fontWeight: "700",
    cursor: "pointer",
  },

  security: {
    textAlign: "center",
    marginTop: "12px",
    color: "#777383",
    fontSize: "9px",
  },

  footer: {
    position: "absolute",
    bottom: "10px",
    color: "#777383",
    fontSize: "10px",
    zIndex: 3,
  },
};

export default Register;