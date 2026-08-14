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

      {/* =========================
          LOGO
      ========================= */}

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


      {/* =========================
          MOBILE MENU BUTTON
      ========================= */}

      <button
        className="mobile-menu-button"
        onClick={() =>
          setMenuOpen(!menuOpen)
        }
      >
        {menuOpen ? "✕" : "☰"}
      </button>


      {/* =========================
          NAVIGATION
      ========================= */}

      <div
        className={`hireflow-nav ${menuOpen ? "mobile-open" : ""
          }`}
      >

        <Link
          to="/"
          onClick={closeMenu}
        >
          🏠 <span>Home</span>
        </Link>

        <Link
          to="/jobs"
          onClick={closeMenu}
        >
          💼 <span>Jobs</span>
        </Link>

        <Link
          to="/profile"
          onClick={closeMenu}
        >
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


        {/* =========================
            USER AREA
        ========================= */}

        <div className="nav-divider"></div>

        {user && (
          <div className="nav-user">

            <div className="user-avatar">
              {user.name
                ? user.name
                  .charAt(0)
                  .toUpperCase()
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


        {/* Logout */}

        {user && (
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            🚪 Logout
          </button>
        )}

      </div>


      {/* =========================
          NAVBAR STYLES
      ========================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .hireflow-navbar {
          width: 100%;
          min-height: 78px;

          display: flex;
          align-items: center;

          padding: 12px 35px;

          background:
            linear-gradient(
              135deg,
              #0f172a,
              #172554 55%,
              #1e1b4b
            );

          border-bottom:
            1px solid rgba(255,255,255,.08);

          box-shadow:
            0 8px 30px rgba(0,0,0,.18);

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
              #2563eb,
              #7c3aed
            );

          font-size: 23px;

          box-shadow:
            0 6px 18px
            rgba(37,99,235,.35);
        }


        .logo-text {
          font-size: 23px;

          color: white;

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

          color:
            rgba(255,255,255,.82);

          text-decoration: none;

          font-size: 14px;

          font-weight: 600;

          border-radius: 9px;

          transition:
            .2s ease;
        }


        .hireflow-nav > a:hover {
          color: white;

          background:
            rgba(255,255,255,.09);

          transform:
            translateY(-1px);
        }


        .hireflow-nav > a:first-child {
          background:
            rgba(255,255,255,.07);
        }


        /* =========================
           DIVIDER
        ========================= */

        .nav-divider {
          width: 1px;

          height: 32px;

          background:
            rgba(255,255,255,.12);

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

          background:
            rgba(255,255,255,.06);
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
              #2563eb,
              #8b5cf6
            );

          color: white;

          font-weight: 800;

          font-size: 14px;
        }


        .user-info {
          display: flex;

          flex-direction: column;

          line-height: 1.2;
        }


        .user-info strong {
          color: white;

          font-size: 12px;

          max-width: 90px;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;
        }


        .user-info small {
          color:
            rgba(255,255,255,.55);

          font-size: 10px;

          margin-top: 2px;
        }


        /* =========================
           LOGOUT
        ========================= */

        .logout-button {
          border: 1px solid
            rgba(248,113,113,.3);

          background:
            rgba(239,68,68,.12);

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

          transform:
            translateY(-1px);
        }


        /* =========================
           MOBILE BUTTON
        ========================= */

        .mobile-menu-button {
          display: none;

          margin-left: auto;

          border: none;

          background:
            rgba(255,255,255,.08);

          color: white;

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