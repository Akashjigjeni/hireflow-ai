import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await API.get("/users/profile");

      setUser(res.data);

      setFormData({
        name: res.data.name || "",
        email: res.data.email || "",
      });
    } catch (error) {
      console.error(error);

      const localUser = JSON.parse(
        localStorage.getItem("user")
      );

      if (localUser) {
        setUser(localUser);

        setFormData({
          name: localUser.name || "",
          email: localUser.email || "",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const res = await API.put(
        "/auth/profile",
        formData
      );

      const updatedUser = res.data.user || res.data;

      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setEditing(false);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <Navbar />

        <div style={styles.loading}>
          <div style={styles.loadingIcon}>👤</div>

          <h2 style={styles.loadingTitle}>
            Loading Profile...
          </h2>

          <p style={styles.loadingText}>
            Please wait a moment
          </p>
        </div>
      </div>
    );
  }

  const initial =
    user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div style={styles.page}>
      <Navbar />

      <main style={styles.container}>

        {/* HEADER */}
        <section style={styles.header}>
          <div style={styles.avatar}>
            {initial}
          </div>

          <div style={styles.headerInfo}>
            <p style={styles.welcomeText}>
              ACCOUNT PROFILE
            </p>

            <h1 style={styles.title}>
              {user?.name || "User"}
            </h1>

            <p style={styles.subtitle}>
              Manage your personal information and account details.
            </p>
          </div>

          <div style={styles.roleBadge}>
            {user?.role === "employer"
              ? "💼 Employer"
              : "👤 Candidate"}
          </div>
        </section>


        {/* PROFILE CARD */}
        <section style={styles.profileCard}>

          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>
                Personal Information
              </h2>

              <p style={styles.cardSubtitle}>
                Update your account details here.
              </p>
            </div>

            {!editing && (
              <button
                style={styles.editButton}
                onClick={() => setEditing(true)}
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>


          {!editing ? (

            <div style={styles.infoGrid}>

              <div style={styles.infoBox}>
                <div style={styles.infoIcon}>
                  👤
                </div>

                <div>
                  <p style={styles.infoLabel}>
                    Full Name
                  </p>

                  <p style={styles.infoValue}>
                    {user?.name || "Not provided"}
                  </p>
                </div>
              </div>


              <div style={styles.infoBox}>
                <div style={styles.infoIcon}>
                  ✉️
                </div>

                <div>
                  <p style={styles.infoLabel}>
                    Email Address
                  </p>

                  <p style={styles.infoValue}>
                    {user?.email || "Not provided"}
                  </p>
                </div>
              </div>


              <div style={styles.infoBox}>
                <div style={styles.infoIcon}>
                  💼
                </div>

                <div>
                  <p style={styles.infoLabel}>
                    Account Type
                  </p>

                  <p style={styles.infoValue}>
                    {user?.role === "employer"
                      ? "Employer"
                      : "Candidate"}
                  </p>
                </div>
              </div>

            </div>

          ) : (

            <form
              onSubmit={handleSave}
              style={styles.form}
            >

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  style={styles.input}
                  required
                />
              </div>


              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  style={styles.input}
                  required
                />
              </div>


              <div style={styles.formActions}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => {
                    setEditing(false);

                    setFormData({
                      name: user?.name || "",
                      email: user?.email || "",
                    });
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={styles.saveButton}
                >
                  ✓ Save Changes
                </button>
              </div>

            </form>

          )}

        </section>


        {/* ACCOUNT SUMMARY */}
        <section style={styles.summarySection}>

          <h2 style={styles.summaryTitle}>
            Account Summary
          </h2>

          <div style={styles.summaryGrid}>

            <div style={styles.summaryCard}>
              <span style={styles.summaryIcon}>
                🛡️
              </span>

              <div>
                <strong style={styles.summaryValue}>
                  Active
                </strong>

                <span style={styles.summaryLabel}>
                  Account Status
                </span>
              </div>
            </div>


            <div style={styles.summaryCard}>
              <span style={styles.summaryIcon}>
                {user?.role === "employer"
                  ? "💼"
                  : "🎯"}
              </span>

              <div>
                <strong style={styles.summaryValue}>
                  {user?.role === "employer"
                    ? "Employer"
                    : "Candidate"}
                </strong>

                <span style={styles.summaryLabel}>
                  Account Role
                </span>
              </div>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
}


/* =====================================================
   DARK CHARCOAL + PURPLE THEME
===================================================== */

const styles = {

  page: {
    minHeight: "100vh",
    background: "#24232A",
    color: "#F5F3FF",
    fontFamily:
      "system-ui, 'Segoe UI', Roboto, Arial, sans-serif",
    paddingBottom: "60px",
  },

  container: {
    width: "min(1050px, calc(100% - 40px))",
    margin: "0 auto",
    paddingTop: "40px",
  },

  /* HEADER */

  header: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
    padding: "26px",
    borderRadius: "18px",
    background: "#302E36",
    border: "1px solid #46414F",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.20)",
  },

  avatar: {
    width: "75px",
    height: "75px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    background:
      "linear-gradient(135deg, #8B5CF6, #A855F7)",
    color: "#FFFFFF",
    fontSize: "30px",
    fontWeight: "800",
    boxShadow:
      "0 8px 22px rgba(139,92,246,0.25)",
  },

  headerInfo: {
    flex: 1,
  },

  welcomeText: {
    margin: 0,
    color: "#A78BFA",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  title: {
    margin: "5px 0",
    color: "#F5F3FF",
    fontSize: "32px",
    fontWeight: "800",
  },

  subtitle: {
    margin: 0,
    color: "#A9A6B8",
    fontSize: "14px",
  },

  roleBadge: {
    padding: "9px 15px",
    borderRadius: "20px",
    background: "#3A2E52",
    border: "1px solid #6D4BC4",
    color: "#C4B5FD",
    fontSize: "13px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },


  /* PROFILE CARD */

  profileCard: {
    background: "#302E36",
    border: "1px solid #46414F",
    borderRadius: "18px",
    padding: "28px",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.18)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    paddingBottom: "22px",
    borderBottom: "1px solid #46414F",
    marginBottom: "22px",
  },

  cardTitle: {
    margin: 0,
    color: "#F5F3FF",
    fontSize: "22px",
  },

  cardSubtitle: {
    margin: "5px 0 0",
    color: "#A9A6B8",
    fontSize: "13px",
  },

  editButton: {
    padding: "10px 17px",
    borderRadius: "9px",
    border: "1px solid #6D4BC4",
    background: "#3A2E52",
    color: "#C4B5FD",
    fontWeight: "700",
    cursor: "pointer",
  },


  /* INFORMATION */

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "16px",
  },

  infoBox: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "18px",
    background: "#3A3842",
    border: "1px solid #46414F",
    borderRadius: "13px",
  },

  infoIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#3A2E52",
    fontSize: "20px",
    flexShrink: 0,
  },

  infoLabel: {
    margin: 0,
    color: "#A9A6B8",
    fontSize: "11px",
  },

  infoValue: {
    margin: "4px 0 0",
    color: "#F5F3FF",
    fontSize: "14px",
    fontWeight: "700",
    wordBreak: "break-word",
  },


  /* FORM */

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  label: {
    color: "#C4B5FD",
    fontSize: "13px",
    fontWeight: "700",
  },

  input: {
    width: "100%",
    padding: "13px 15px",
    borderRadius: "9px",
    border: "1px solid #46414F",
    background: "#3A3842",
    color: "#F5F3FF",
    fontSize: "14px",
    outline: "none",
  },

  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "5px",
  },

  cancelButton: {
    padding: "11px 18px",
    borderRadius: "9px",
    border: "1px solid #46414F",
    background: "#3A3842",
    color: "#A9A6B8",
    fontWeight: "700",
    cursor: "pointer",
  },

  saveButton: {
    padding: "11px 18px",
    border: "none",
    borderRadius: "9px",
    background:
      "linear-gradient(135deg, #8B5CF6, #A855F7)",
    color: "#FFFFFF",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow:
      "0 6px 18px rgba(139,92,246,0.25)",
  },


  /* SUMMARY */

  summarySection: {
    marginTop: "30px",
  },

  summaryTitle: {
    margin: "0 0 15px",
    color: "#F5F3FF",
    fontSize: "22px",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "16px",
  },

  summaryCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "20px",
    borderRadius: "15px",
    background: "#302E36",
    border: "1px solid #46414F",
    boxShadow:
      "0 6px 18px rgba(0,0,0,0.15)",
  },

  summaryIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#3A2E52",
    fontSize: "21px",
  },

  summaryValue: {
    display: "block",
    color: "#F5F3FF",
    fontSize: "15px",
  },

  summaryLabel: {
    display: "block",
    color: "#A9A6B8",
    fontSize: "11px",
    marginTop: "3px",
  },


  /* LOADING */

  loading: {
    minHeight: "calc(100vh - 70px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#24232A",
  },

  loadingIcon: {
    width: "65px",
    height: "65px",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #8B5CF6, #A855F7)",
    fontSize: "30px",
    marginBottom: "15px",
  },

  loadingTitle: {
    margin: 0,
    color: "#F5F3FF",
  },

  loadingText: {
    margin: "7px 0 0",
    color: "#A9A6B8",
  },
};

export default Profile;