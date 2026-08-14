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
      console.error(err);

      setMessage(
        err.response?.data?.message ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Background */}
      <div className="login-background"></div>

      {/* Overlay */}
      <div className="login-overlay"></div>

      {/* Main Card */}
      <div className="login-container">

        {/* =========================
            LEFT SIDE
        ========================= */}

        <div className="login-left">

          <div className="logo-row">

            <div className="logo-box">
              H
            </div>

            <div>
              <h2 className="logo-text">
                HireFlow <span>AI</span>
              </h2>

              <p className="logo-sub">
                Smart Hiring. Better Careers.
              </p>
            </div>

          </div>


          <div className="left-content">

            <div className="badge">
              ✨ AI-POWERED RECRUITMENT
            </div>

            <h1 className="main-title">
              Smarter Hiring.
              <br />
              <span>Better Careers.</span>
            </h1>

            <p className="description">
              HireFlow AI connects talented
              candidates with the right
              opportunities through intelligent
              recruitment technology.
            </p>


            <div className="features">

              <div className="feature">

                <div className="feature-icon">
                  🤖
                </div>

                <div>
                  <b>AI Resume Analysis</b>

                  <small>
                    Smart screening & matching
                  </small>
                </div>

              </div>


              <div className="feature">

                <div className="feature-icon">
                  🎯
                </div>

                <div>
                  <b>Smart Interviews</b>

                  <small>
                    AI-generated interview questions
                  </small>
                </div>

              </div>


              <div className="feature">

                <div className="feature-icon">
                  ⚡
                </div>

                <div>
                  <b>Faster Hiring</b>

                  <small>
                    Streamlined recruitment process
                  </small>
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="login-right">

          <div className="form-card">

            <div className="user-icon">
              👤
            </div>

            <h2 className="welcome">
              Welcome Back!
            </h2>

            <p className="subtitle">
              Sign in to continue to your account
            </p>


            {/* Message */}

            {message && (
              <div
                className={
                  message.includes("successful")
                    ? "message success"
                    : "message error"
                }
              >
                {message}
              </div>
            )}


            <form onSubmit={handleSubmit}>

              {/* EMAIL */}

              <label className="label">
                Email Address
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ✉️
                </span>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* PASSWORD */}

              <label className="label password-label">
                Password
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
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
                />

                <button
                  type="button"
                  className="eye-button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>


              {/* LOGIN */}

              <button
                type="submit"
                disabled={loading}
                className="login-button"
              >
                {loading
                  ? "Signing in..."
                  : "🔐 Sign In"}
              </button>

            </form>


            <div className="security">
              🔒 Your data is secure and protected
            </div>


            <p className="register-text">
              Don't have an account?

              <span
                onClick={() =>
                  navigate("/register")
                }
              >
                Create Account
              </span>
            </p>

          </div>

        </div>

      </div>


      {/* Footer */}

      <div className="footer">
        © 2026 HireFlow AI. All rights reserved.
      </div>


      {/* =========================
          CSS
      ========================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }


        body {
          margin: 0;
        }


        .login-page {
          width: 100%;
          min-height: 100vh;

          position: relative;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 25px 15px;

          overflow-x: hidden;

          font-family:
            "Segoe UI",
            Arial,
            sans-serif;
        }


        /* =========================
           BACKGROUND
        ========================= */

        .login-background {
          position: fixed;
          inset: 0;

          background-image:
            url("https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=2000&q=85");

          background-size: cover;
          background-position: center;

          filter: blur(6px);

          transform: scale(1.05);

          z-index: 0;
        }


        .login-overlay {
          position: fixed;
          inset: 0;

          background:
            linear-gradient(
              135deg,
              rgba(15,23,42,.88),
              rgba(30,64,175,.68),
              rgba(76,29,149,.65)
            );

          backdrop-filter: blur(3px);

          z-index: 1;
        }


        /* =========================
           MAIN CONTAINER
        ========================= */

        .login-container {
          position: relative;
          z-index: 2;

          width: min(
            1000px,
            calc(100% - 20px)
          );

          min-height: 590px;

          display: grid;

          grid-template-columns:
            1fr .9fr;

          border-radius: 24px;

          overflow: hidden;

          background:
            rgba(255,255,255,.13);

          border:
            1px solid
            rgba(255,255,255,.3);

          box-shadow:
            0 30px 80px
            rgba(0,0,0,.4);

          backdrop-filter: blur(25px);

          -webkit-backdrop-filter:
            blur(25px);
        }


        /* =========================
           LEFT
        ========================= */

        .login-left {
          padding: 42px;

          color: white;

          background:
            linear-gradient(
              145deg,
              rgba(15,23,42,.58),
              rgba(37,99,235,.28)
            );
        }


        .logo-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }


        .logo-box {
          width: 46px;
          height: 46px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 13px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #7c3aed
            );

          font-size: 24px;
          font-weight: 800;

          box-shadow:
            0 8px 25px
            rgba(37,99,235,.4);
        }


        .logo-text {
          margin: 0;

          font-size: 23px;

          font-weight: 800;
        }


        .logo-text span {
          color: #a78bfa;
        }


        .logo-sub {
          margin: 2px 0 0;

          font-size: 10px;

          opacity: .7;
        }


        .left-content {
          margin-top: 70px;
        }


        .badge {
          display: inline-block;

          padding: 7px 12px;

          border-radius: 20px;

          background:
            rgba(255,255,255,.12);

          border:
            1px solid
            rgba(255,255,255,.25);

          font-size: 10px;

          letter-spacing:
            .5px;
        }


        .main-title {
          margin:
            18px 0;

          font-size:
            clamp(
              34px,
              4vw,
              43px
            );

          line-height: 1.1;

          letter-spacing: -1.5px;

          font-weight: 800;
        }


        .main-title span {
          color: #c4b5fd;
        }


        .description {
          max-width: 430px;

          margin: 0;

          color:
            rgba(255,255,255,.82);

          font-size: 14px;

          line-height: 1.7;
        }


        .features {
          margin-top: 28px;

          display: flex;

          flex-direction: column;

          gap: 14px;
        }


        .feature {
          display: flex;

          align-items: center;

          gap: 12px;
        }


        .feature-icon {
          width: 38px;
          height: 38px;

          flex-shrink: 0;

          border-radius: 10px;

          background:
            rgba(255,255,255,.14);

          display: flex;

          align-items: center;
          justify-content: center;

          font-size: 17px;
        }


        .feature b {
          display: block;

          font-size: 13px;
        }


        .feature small {
          display: block;

          margin-top: 3px;

          color:
            rgba(255,255,255,.65);

          font-size: 10px;
        }


        /* =========================
           RIGHT
        ========================= */

        .login-right {
          display: flex;

          align-items: center;
          justify-content: center;

          padding: 40px;

          background:
            rgba(255,255,255,.94);
        }


        .form-card {
          width: 100%;

          max-width: 360px;

          color: #172554;
        }


        .user-icon {
          width: 48px;
          height: 48px;

          border-radius: 50%;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #7c3aed
            );

          display: flex;

          align-items: center;
          justify-content: center;

          font-size: 21px;

          margin-bottom: 14px;
        }


        .welcome {
          margin: 0;

          font-size: 28px;

          font-weight: 800;
        }


        .subtitle {
          margin:
            6px 0 24px;

          color: #64748b;

          font-size: 13px;
        }


        /* =========================
           MESSAGE
        ========================= */

        .message {
          padding: 10px;

          border-radius: 8px;

          margin-bottom: 15px;

          font-size: 12px;

          text-align: center;

          font-weight: 600;
        }


        .success {
          background: #ecfdf5;
          color: #15803d;
        }


        .error {
          background: #fef2f2;
          color: #dc2626;
        }


        /* =========================
           FORM
        ========================= */

        .label {
          display: block;

          margin-bottom: 7px;

          font-size: 12px;

          font-weight: 700;

          color: #334155;
        }


        .password-label {
          margin-top: 18px;
        }


        .input-wrapper {
          height: 48px;

          display: flex;

          align-items: center;

          border:
            1px solid #d7deeb;

          border-radius: 10px;

          background: #f8fafc;

          overflow: hidden;

          transition: .2s;
        }


        .input-wrapper:focus-within {
          border-color: #2563eb;

          background: white;

          box-shadow:
            0 0 0 3px
            rgba(37,99,235,.08);
        }


        .input-icon {
          padding-left: 13px;

          font-size: 14px;
        }


        .input-wrapper input {
          flex: 1;

          min-width: 0;

          width: 100%;

          height: 100%;

          border: none;

          outline: none;

          background: transparent;

          padding:
            0 10px;

          font-size: 13px;

          color: #172554;
        }


        .eye-button {
          width: 42px;
          height: 100%;

          border: none;

          background: transparent;

          cursor: pointer;

          font-size: 14px;
        }


        .login-button {
          width: 100%;

          height: 50px;

          margin-top: 25px;

          border: none;

          border-radius: 10px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #7c3aed
            );

          color: white;

          font-size: 14px;

          font-weight: 700;

          cursor: pointer;

          box-shadow:
            0 10px 25px
            rgba(37,99,235,.28);

          transition: .2s;
        }


        .login-button:hover:not(:disabled) {
          transform:
            translateY(-2px);

          box-shadow:
            0 14px 28px
            rgba(37,99,235,.35);
        }


        .login-button:disabled {
          cursor: not-allowed;
        }


        .security {
          text-align: center;

          margin-top: 20px;

          color: #64748b;

          font-size: 10px;
        }


        .register-text {
          text-align: center;

          margin-top: 15px;

          color: #64748b;

          font-size: 12px;
        }


        .register-text span {
          margin-left: 5px;

          color: #2563eb;

          font-weight: 700;

          cursor: pointer;
        }


        .footer {
          position: fixed;

          bottom: 8px;

          left: 0;
          right: 0;

          text-align: center;

          color:
            rgba(255,255,255,.7);

          font-size: 10px;

          z-index: 3;

          pointer-events: none;
        }


        /* =========================
           TABLET
        ========================= */

        @media (max-width: 800px) {

          .login-page {
            min-height: 100vh;

            padding:
              20px 12px 45px;

            align-items: center;
          }


          .login-container {
            width:
              min(
                520px,
                100%
              );

            min-height: auto;

            grid-template-columns: 1fr;

            overflow: hidden;

            border-radius: 20px;
          }


          .login-left {
            padding: 28px 25px;

            text-align: center;
          }


          .logo-row {
            justify-content: center;
          }


          .left-content {
            margin-top: 25px;
          }


          .main-title {
            font-size: 35px;
          }


          .description {
            margin:
              0 auto;

            max-width:
              500px;
          }


          .features {
            display: grid;

            grid-template-columns:
              repeat(3, 1fr);

            text-align: left;

            gap: 10px;
          }


          .feature {
            align-items: flex-start;
          }


          .login-right {
            padding:
              30px 25px;
          }


          .form-card {
            max-width:
              420px;
          }

        }


        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 520px) {

          .login-page {
            display: block;

            min-height: 100vh;

            padding:
              12px 10px 40px;

            overflow-y: auto;
          }


          .login-container {
            width: 100%;

            margin:
              0 auto;

            border-radius: 18px;

            display: block;
          }


          .login-left {
            padding:
              24px 18px 20px;
          }


          .logo-box {
            width: 40px;
            height: 40px;

            font-size: 20px;
          }


          .logo-text {
            font-size: 20px;
          }


          .logo-sub {
            font-size: 9px;
          }


          .left-content {
            margin-top: 22px;
          }


          .badge {
            font-size: 9px;

            padding:
              6px 9px;
          }


          .main-title {
            font-size: 29px;

            letter-spacing:
              -.8px;

            margin:
              15px 0;
          }


          .description {
            font-size: 12px;

            line-height: 1.6;
          }


          .features {
            margin-top: 20px;

            grid-template-columns: 1fr;

            gap: 9px;
          }


          .feature {
            gap: 9px;
          }


          .feature-icon {
            width: 34px;
            height: 34px;

            font-size: 14px;
          }


          .feature b {
            font-size: 12px;
          }


          .feature small {
            font-size: 9px;
          }


          .login-right {
            padding:
              26px 18px 24px;

            background:
              rgba(255,255,255,.97);
          }


          .form-card {
            max-width: 100%;
          }


          .user-icon {
            width: 44px;
            height: 44px;

            font-size: 19px;

            margin:
              0 auto 11px;
          }


          .welcome {
            text-align: center;

            font-size: 24px;
          }


          .subtitle {
            text-align: center;

            font-size: 11px;

            margin-bottom: 20px;
          }


          .message {
            font-size: 11px;
          }


          .input-wrapper {
            height: 46px;
          }


          .login-button {
            height: 48px;

            font-size: 13px;
          }


          .security {
            margin-top: 15px;

            font-size: 9px;
          }


          .register-text {
            font-size: 11px;
          }


          .footer {
            bottom: 4px;

            font-size: 8px;
          }

        }


        /* =========================
           VERY SMALL PHONES
        ========================= */

        @media (max-width: 360px) {

          .login-page {
            padding:
              8px 7px 35px;
          }


          .login-left {
            padding:
              20px 14px 18px;
          }


          .main-title {
            font-size: 25px;
          }


          .description {
            font-size: 11px;
          }


          .login-right {
            padding:
              22px 14px;
          }


          .welcome {
            font-size: 22px;
          }

        }

      `}</style>

    </div>
  );
}

export default Login;