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

      {/* Blur Overlay */}
      <div style={styles.overlay}></div>

      {/* Main Card */}
      <div style={styles.container}>

        {/* ================= LEFT SIDE ================= */}

        <div style={styles.left}>

          <div style={styles.logoRow}>
            <div style={styles.logo}>H</div>

            <div>
              <h2 style={styles.logoText}>
                HireFlow <span>AI</span>
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
              <span>Career Journey.</span>
            </h1>

            <p style={styles.description}>
              Join HireFlow AI and discover smarter
              opportunities or find the perfect talent
              for your organization.
            </p>

            <div style={styles.features}>

              <div style={styles.feature}>
                <div style={styles.featureIcon}>
                  👤
                </div>

                <div>
                  <b>For Candidates</b>
                  <small>
                    Discover your dream job
                  </small>
                </div>
              </div>

              <div style={styles.feature}>
                <div style={styles.featureIcon}>
                  🏢
                </div>

                <div>
                  <b>For Employers</b>
                  <small>
                    Find the right talent
                  </small>
                </div>
              </div>

              <div style={styles.feature}>
                <div style={styles.featureIcon}>
                  🤖
                </div>

                <div>
                  <b>AI-Powered Hiring</b>
                  <small>
                    Faster and smarter recruitment
                  </small>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}

        <div style={styles.right}>

          <div style={styles.formCard}>

            <div style={styles.userIcon}>
              ✨
            </div>

            <h2 style={styles.welcome}>
              Create Account
            </h2>

            <p style={styles.subtitle}>
              Join HireFlow AI today
            </p>

            {/* Message */}

            {message && (
              <div
                style={{
                  ...styles.message,
                  background: message.includes(
                    "Successful"
                  )
                    ? "#ecfdf5"
                    : "#fef2f2",

                  color: message.includes(
                    "Successful"
                  )
                    ? "#15803d"
                    : "#dc2626",
                }}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Full Name */}

              <label style={styles.label}>
                Full Name
              </label>

              <div style={styles.inputWrapper}>

                <span style={styles.inputIcon}>
                  👤
                </span>

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

              {/* Email */}

              <label
                style={{
                  ...styles.label,
                  marginTop: "12px",
                }}
              >
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

              {/* Password */}

              <label
                style={{
                  ...styles.label,
                  marginTop: "12px",
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

              {/* Account Type */}

              <label
                style={{
                  ...styles.label,
                  marginTop: "12px",
                }}
              >
                Account Type
              </label>

              <div style={styles.roleContainer}>

                {/* Candidate */}

                <label
                  style={{
                    ...styles.roleOption,

                    border:
                      formData.role === "candidate"
                        ? "2px solid #2563eb"
                        : "1px solid #d7deeb",

                    background:
                      formData.role === "candidate"
                        ? "#eff6ff"
                        : "#f8fafc",
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

                  <span>
                    👤 Candidate
                  </span>

                </label>

                {/* Employer */}

                <label
                  style={{
                    ...styles.roleOption,

                    border:
                      formData.role === "employer"
                        ? "2px solid #7c3aed"
                        : "1px solid #d7deeb",

                    background:
                      formData.role === "employer"
                        ? "#f5f3ff"
                        : "#f8fafc",
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

                  <span>
                    🏢 Employer
                  </span>

                </label>

              </div>

              {/* Create Account */}

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
                  : "🚀  Create Account"}
              </button>

            </form>

            {/* Login */}

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

      {/* Footer */}

      <div style={styles.footer}>
        © 2026 HireFlow AI. All rights reserved.
      </div>

    </div>
  );
}


/* =====================================================
   STYLES
===================================================== */

const styles = {

  /* Page */

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
  },


  /* Background Image */

  background: {
    position: "absolute",
    inset: 0,

    backgroundImage:
      "url('https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=2000&q=85')",

    backgroundSize: "cover",
    backgroundPosition: "center",

    filter: "blur(5px)",

    transform: "scale(1.05)",

    zIndex: 0,
  },


  /* Overlay */

  overlay: {
    position: "absolute",
    inset: 0,

    background:
      "linear-gradient(135deg, rgba(15,23,42,0.82), rgba(30,64,175,0.65), rgba(76,29,149,0.62))",

    backdropFilter: "blur(3px)",

    zIndex: 1,
  },


  /* Main Card */

  container: {
    width: "min(1000px, calc(100% - 40px))",

    height: "min(650px, calc(100vh - 80px))",

    display: "grid",

    gridTemplateColumns:
      "1fr 0.9fr",

    borderRadius: "24px",

    overflow: "hidden",

    background:
      "rgba(255,255,255,0.14)",

    backdropFilter: "blur(25px)",

    WebkitBackdropFilter:
      "blur(25px)",

    border:
      "1px solid rgba(255,255,255,0.35)",

    boxShadow:
      "0 30px 80px rgba(0,0,0,0.35)",

    position: "relative",

    zIndex: 2,
  },


  /* Left */

  left: {
    padding: "42px",

    color: "white",

    background:
      "linear-gradient(145deg, rgba(15,23,42,0.55), rgba(37,99,235,0.32))",

    boxSizing: "border-box",

    overflow: "hidden",
  },


  /* Logo */

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
      "linear-gradient(135deg,#2563eb,#7c3aed)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "24px",
    fontWeight: "800",

    boxShadow:
      "0 8px 25px rgba(37,99,235,0.4)",
  },

  logoText: {
    margin: 0,

    fontSize: "23px",

    fontWeight: "800",
  },

  logoSub: {
    margin: "2px 0 0",

    fontSize: "10px",

    opacity: 0.7,
  },


  /* Left Content */

  leftContent: {
    marginTop: "45px",
  },

  badge: {
    display: "inline-block",

    padding: "7px 12px",

    borderRadius: "20px",

    background:
      "rgba(255,255,255,0.12)",

    border:
      "1px solid rgba(255,255,255,0.25)",

    fontSize: "10px",

    letterSpacing: "0.5px",
  },

  title: {
    fontSize: "36px",

    lineHeight: "1.1",

    letterSpacing: "-1.5px",

    margin: "18px 0",

    fontWeight: "800",
  },

  description: {
    maxWidth: "430px",

    fontSize: "14px",

    lineHeight: "1.7",

    color:
      "rgba(255,255,255,0.82)",
  },


  /* Features */

  features: {
    marginTop: "25px",

    display: "flex",

    flexDirection: "column",

    gap: "12px",
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

    background:
      "rgba(255,255,255,0.14)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "17px",

    flexShrink: 0,
  },


  /* Right */

  right: {
    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    padding: "28px 35px",

    background:
      "rgba(255,255,255,0.92)",

    boxSizing: "border-box",

    overflowY: "auto",

    minHeight: 0,
  },


  /* Form */

  formCard: {
    width: "100%",

    maxWidth: "370px",

    color: "#172554",

    padding: "5px 0",
  },

  userIcon: {
    width: "46px",
    height: "46px",

    borderRadius: "50%",

    background:
      "linear-gradient(135deg,#2563eb,#7c3aed)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "20px",

    marginBottom: "10px",
  },

  welcome: {
    fontSize: "27px",

    margin: 0,

    fontWeight: "800",
  },

  subtitle: {
    marginTop: "5px",

    marginBottom: "18px",

    color: "#64748b",

    fontSize: "13px",
  },


  /* Message */

  message: {
    padding: "9px",

    borderRadius: "8px",

    marginBottom: "12px",

    fontSize: "12px",

    textAlign: "center",

    fontWeight: "600",
  },


  /* Labels */

  label: {
    display: "block",

    marginBottom: "6px",

    fontSize: "12px",

    fontWeight: "700",

    color: "#334155",
  },


  /* Inputs */

  inputWrapper: {
    height: "44px",

    display: "flex",

    alignItems: "center",

    border:
      "1px solid #d7deeb",

    borderRadius: "9px",

    background: "#f8fafc",

    overflow: "hidden",
  },

  inputIcon: {
    paddingLeft: "12px",

    fontSize: "13px",
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

    color: "#172554",
  },

  eyeButton: {
    border: "none",

    background: "transparent",

    cursor: "pointer",

    padding: "9px",

    fontSize: "13px",
  },


  /* Role */

  roleContainer: {
    display: "grid",

    gridTemplateColumns:
      "1fr 1fr",

    gap: "10px",

    marginBottom: "0",
  },

  roleOption: {
    minHeight: "42px",

    padding: "8px",

    borderRadius: "9px",

    cursor: "pointer",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "7px",

    fontSize: "12px",

    fontWeight: "600",

    boxSizing: "border-box",
  },


  /* Register Button */

  registerButton: {
    width: "100%",

    height: "48px",

    marginTop: "16px",

    border: "none",

    borderRadius: "9px",

    background:
      "linear-gradient(135deg,#2563eb,#7c3aed)",

    color: "white",

    fontSize: "14px",

    fontWeight: "700",

    cursor: "pointer",

    boxShadow:
      "0 10px 25px rgba(37,99,235,0.28)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",
  },


  /* Login Link */

  loginText: {
    textAlign: "center",

    marginTop: "14px",

    fontSize: "12px",

    color: "#64748b",
  },

  loginLink: {
    color: "#2563eb",

    fontWeight: "700",

    cursor: "pointer",
  },


  /* Security */

  security: {
    textAlign: "center",

    marginTop: "10px",

    color: "#64748b",

    fontSize: "9px",
  },


  /* Footer */

  footer: {
    position: "absolute",

    bottom: "7px",

    color:
      "rgba(255,255,255,0.7)",

    fontSize: "10px",

    zIndex: 3,
  },
};

export default Register;