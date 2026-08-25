import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMenuOpen(false);

    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="hireflow-navbar">

      {/* LOGO */}
      <Link
        to="/"
        className="hireflow-logo"
        onClick={closeMenu}
      >
        <div className="logo-icon">
          🚀
        </div>

        <div className="logo-text">
          <span>HireFlow</span>
          <strong>AI</strong>
        </div>
      </Link>

      {/* MOBILE MENU BUTTON */}
      <button
        className="mobile-menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* NAVIGATION */}
      <div
        className={`hireflow-nav ${
          menuOpen ? "mobile-open" : ""
        }`}
      >

        <Link to="/" onClick={closeMenu}>
          🏠 <span>Home</span>
        </Link>

        <Link to="/jobs" onClick={closeMenu}>
          💼 <span>Jobs</span>
        </Link>

        <Link to="/profile" onClick={closeMenu}>
          👤 <span>Profile</span>
        </Link>

        {/* Candidate Dashboard */}
        {user?.role === "candidate" && (
          <>
            <Link
              to="/candidate-dashboard"
              onClick={closeMenu}
            >
              📊 <span>Dashboard</span>
            </Link>

            <Link
              to="/saved-jobs"
              onClick={closeMenu}
            >
              ❤️ <span>Saved Jobs</span>
            </Link>

            <Link
              to="/my-applications"
              onClick={closeMenu}
            >
              📄 <span>Applications</span>
            </Link>
          </>
        )}

        {/* Employer Dashboard */}
        {user?.role === "employer" && (
          <>
            <Link
              to="/employer-dashboard"
              onClick={closeMenu}
            >
              🏢 <span>Dashboard</span>
            </Link>

            <Link
              to="/post-job"
              onClick={closeMenu}
            >
              ➕ <span>Post Job</span>
            </Link>
          </>
        )}

        <div className="nav-divider"></div>

        {/* GUEST ACTIONS */}
        {!user && (
          <div className="nav-guest-actions">
            <Link
              to="/login"
              onClick={closeMenu}
              className="nav-btn-login"
            >
              🔑 <span>Login</span>
            </Link>

            <Link
              to="/register"
              onClick={closeMenu}
              className="nav-btn-register"
            >
              ✨ <span>Register</span>
            </Link>
          </div>
        )}

        {/* USER */}
        {user && (
          <div className="nav-user">
            <div className="user-avatar">
              {user.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div className="user-info">
              <strong>
                {user.name || "User"}
              </strong>

              <small>
                {user.role === "employer"
                  ? "Employer"
                  : "Candidate"}
              </small>
            </div>
          </div>
        )}

        {/* LOGOUT */}
        {user && (
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            🚪 Logout
          </button>
        )}

      </div>

      <style>{`

        * {
          box-sizing: border-box;
        }

        /* =========================
           NAVBAR
        ========================= */

        .hireflow-navbar {
          width: 100%;
          min-height: 78px;

          display: flex;
          align-items: center;

          padding: 12px 35px;

          background: #302e36;

          border-bottom: 1px solid #46414f;

          box-shadow: 0 8px 30px rgba(0,0,0,.25);

          position: relative;
          z-index: 1000;
        }

        /* =========================
           LOGO
        ========================= */

        .hireflow-logo {
          display: flex;
          align-items: center;

          gap: 11px;

          text-decoration: none;

          min-width: 210px;
        }

        .logo-icon {
          width: 45px;
          height: 45px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 13px;

          background:
            linear-gradient(
              135deg,
              #8b5cf6,
              #a855f7
            );

          font-size: 23px;

          box-shadow:
            0 6px 18px
            rgba(139,92,246,.35);
        }

        .logo-text {
          font-size: 23px;

          color: #f5f3ff;

          font-weight: 700;

          letter-spacing: -.5px;
        }

        .logo-text strong {
          color: #a78bfa;

          margin-left: 3px;
        }

        /* =========================
           NAVIGATION
        ========================= */

        .hireflow-nav {
          flex: 1;

          display: flex;

          align-items: center;

          justify-content: flex-end;

          gap: 5px;
        }

        .hireflow-nav > a {
          display: flex;

          align-items: center;

          gap: 7px;

          padding: 10px 12px;

          color: #a9a6b8;

          text-decoration: none;

          font-size: 14px;

          font-weight: 600;

          border-radius: 9px;

          transition: .2s ease;
        }

        .hireflow-nav > a:hover {
          color: #f5f3ff;

          background: #3a2e52;

          transform: translateY(-1px);
        }

        .hireflow-nav > a:first-child {
          background: rgba(139,92,246,.12);

          color: #c4b5fd;
        }

        /* =========================
           DIVIDER
        ========================= */

        .nav-divider {
          width: 1px;

          height: 32px;

          background: #46414f;

          margin: 0 8px;
        }

        /* =========================
           USER
        ========================= */

        .nav-user {
          display: flex;

          align-items: center;

          gap: 9px;

          padding: 6px 10px;

          border-radius: 11px;

          background: #383540;

          border: 1px solid #46414f;
        }

        .user-avatar {
          width: 35px;
          height: 35px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background:
            linear-gradient(
              135deg,
              #8b5cf6,
              #a855f7
            );

          color: #ffffff;

          font-weight: 800;

          font-size: 14px;
        }

        .user-info {
          display: flex;

          flex-direction: column;

          line-height: 1.2;
        }

        .user-info strong {
          color: #f5f3ff;

          font-size: 12px;

          max-width: 90px;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;
        }

        .user-info small {
          color: #a9a6b8;

          font-size: 10px;

          margin-top: 2px;
        }

        /* =========================
           LOGOUT
        ========================= */

        .logout-button {
          border: 1px solid #7f3a46;

          background: #3a252c;

          color: #fca5a5;

          padding: 9px 14px;

          border-radius: 9px;

          cursor: pointer;

          font-size: 13px;

          font-weight: 700;

          transition: .2s ease;
        }

        .logout-button:hover {
          background: #ef4444;

          color: white;

          border-color: #ef4444;

          transform: translateY(-1px);
        }

        /* =========================
           GUEST ACTIONS
        ========================= */

        .nav-guest-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-btn-login {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
          color: #c4b5fd;
          text-decoration: none;
          background: rgba(139,92,246,.12);
          border: 1px solid rgba(139,92,246,.25);
          transition: .2s ease;
        }

        .nav-btn-login:hover {
          background: rgba(139,92,246,.25);
          color: #ffffff;
          transform: translateY(-1px);
        }

        .nav-btn-register {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 15px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          text-decoration: none;
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          box-shadow: 0 4px 14px rgba(139,92,246,.35);
          transition: .2s ease;
        }

        .nav-btn-register:hover {
          background: linear-gradient(135deg, #7c3aed, #9333ea);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(139,92,246,.5);
        }

        /* =========================
           MOBILE BUTTON
        ========================= */

        .mobile-menu-button {
          display: none;

          margin-left: auto;

          border: 1px solid #46414f;

          background: #383540;

          color: #f5f3ff;

          width: 42px;

          height: 42px;

          border-radius: 9px;

          font-size: 21px;

          cursor: pointer;
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 1100px) {

          .hireflow-navbar {
            padding: 12px 20px;
          }

          .hireflow-logo {
            min-width: 180px;
          }

          .hireflow-nav > a {
            padding: 9px 8px;

            font-size: 13px;
          }

        }

        @media (max-width: 850px) {

          .hireflow-navbar {
            flex-wrap: wrap;

            min-height: 70px;
          }

          .mobile-menu-button {
            display: block;
          }

          .hireflow-nav {
            display: none;

            width: 100%;

            flex-direction: column;

            align-items: stretch;

            justify-content: flex-start;

            gap: 5px;

            padding: 15px 0 5px;
          }

          .hireflow-nav.mobile-open {
            display: flex;
          }

          .hireflow-nav > a {
            width: 100%;

            padding: 12px 15px;

            font-size: 14px;
          }

          .nav-divider {
            width: 100%;

            height: 1px;

            margin: 8px 0;
          }

          .nav-user {
            width: 100%;
          }

          .logout-button {
            width: 100%;

            padding: 12px;
          }

        }

      `}</style>

    </nav>
  );
}

export default Navbar;