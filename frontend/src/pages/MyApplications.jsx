import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get("/applications/my");
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusStyle = (status) => {
    if (status === "Accepted") {
      return {
        background: "rgba(34, 197, 94, 0.15)",
        color: "#4ADE80",
        border: "1px solid rgba(34, 197, 94, 0.4)",
      };
    }

    if (status === "Rejected") {
      return {
        background: "rgba(239, 68, 68, 0.15)",
        color: "#FCA5A5",
        border: "1px solid rgba(239, 68, 68, 0.4)",
      };
    }

    return {
      background: "rgba(139, 92, 246, 0.15)",
      color: "#C4B5FD",
      border: "1px solid rgba(139, 92, 246, 0.4)",
    };
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <Navbar />

        <div style={styles.loading}>
          <div style={styles.loadingIcon}>⏳</div>
          <h2 style={styles.loadingTitle}>
            Loading Applications...
          </h2>
          <p style={styles.loadingText}>
            Please wait
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerIcon}>📄</div>

          <h1 style={styles.title}>
            My Applications
          </h1>

          <p style={styles.subtitle}>
            Track all your job applications in one place
          </p>
        </div>

        {/* Application Count */}
        {applications.length > 0 && (
          <div style={styles.countBox}>
            <span style={styles.countLabel}>
              📊 Total Applications
            </span>

            <strong style={styles.countNumber}>
              {applications.length}
            </strong>
          </div>
        )}

        {/* No Applications */}
        {applications.length === 0 ? (
          <div style={styles.emptyBox}>
            <div style={styles.emptyIcon}>
              📭
            </div>

            <h2 style={styles.emptyTitle}>
              No Applications Found
            </h2>

            <p style={styles.emptyText}>
              You haven't applied for any jobs yet.
            </p>
          </div>
        ) : (
          <div style={styles.applicationList}>

            {applications.map((app) => (

              <div
                key={app._id}
                style={styles.card}
              >

                {/* Job Header */}
                <div style={styles.cardHeader}>

                  <div>
                    <h2 style={styles.jobTitle}>
                      💼 {app.job?.title || "Job"}
                    </h2>

                    <p style={styles.company}>
                      🏢 {app.job?.company || "Company"}
                    </p>
                  </div>

                  <div
                    style={{
                      ...styles.status,
                      ...getStatusStyle(app.status),
                    }}
                  >
                    {app.status === "Accepted"
                      ? "✓ Accepted"
                      : app.status === "Rejected"
                      ? "✕ Rejected"
                      : "⏳ Pending"}
                  </div>

                </div>

                {/* Job Information */}
                <div style={styles.infoGrid}>

                  <div style={styles.infoItem}>
                    <span style={styles.infoIcon}>📍</span>

                    <div>
                      <small style={styles.infoLabel}>
                        Location
                      </small>

                      <strong style={styles.infoValue}>
                        {app.job?.location || "Not specified"}
                      </strong>
                    </div>
                  </div>

                  <div style={styles.infoItem}>
                    <span style={styles.infoIcon}>💰</span>

                    <div>
                      <small style={styles.infoLabel}>
                        Salary
                      </small>

                      <strong style={styles.infoValue}>
                        {app.job?.salaryRange || "Not specified"}
                      </strong>
                    </div>
                  </div>

                </div>

                {/* Cover Letter */}
                <div style={styles.coverBox}>

                  <h3 style={styles.coverTitle}>
                    ✍️ Cover Letter
                  </h3>

                  <p style={styles.coverText}>
                    {app.coverLetter ||
                      "No cover letter provided."}
                  </p>

                </div>

                {/* Application Date */}
                {app.createdAt && (
                  <div style={styles.date}>
                    📅 Applied on{" "}
                    {new Date(
                      app.createdAt
                    ).toLocaleDateString()}
                  </div>
                )}

              </div>

            ))}

          </div>
        )}

      </div>
    </div>
  );
}


/* =====================================================
   STYLES
===================================================== */

const styles = {

  page: {
    minHeight: "100vh",
    background: "#24232A",
    color: "#F5F3FF",
    fontFamily: "system-ui, 'Segoe UI', Roboto, Arial, sans-serif",
  },

  container: {
    width: "min(1050px, calc(100% - 40px))",
    margin: "0 auto",
    padding: "45px 0 70px",
  },

  /* Header */

  header: {
    textAlign: "center",
    marginBottom: "35px",
  },

  headerIcon: {
    width: "64px",
    height: "64px",
    margin: "0 auto 14px",
    borderRadius: "16px",

    background:
      "linear-gradient(135deg, #8B5CF6, #A855F7)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "30px",

    boxShadow:
      "0 10px 25px rgba(139, 92, 246, 0.30)",
  },

  title: {
    margin: 0,
    fontSize: "38px",
    fontWeight: "800",
    color: "#F5F3FF",
  },

  subtitle: {
    marginTop: "8px",
    color: "#A9A6B8",
    fontSize: "15px",
  },

  /* Count Box */

  countBox: {
    maxWidth: "330px",
    margin: "0 auto 30px",

    padding: "15px 20px",

    borderRadius: "12px",

    background: "#302E36",
    border: "1px solid #46414F",

    color: "#F5F3FF",

    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    boxShadow:
      "0 8px 20px rgba(0,0,0,0.18)",
  },

  countLabel: {
    color: "#C4B5FD",
    fontWeight: "600",
  },

  countNumber: {
    color: "#FFFFFF",
    fontSize: "22px",
  },

  /* Empty State */

  emptyBox: {
    maxWidth: "600px",
    margin: "40px auto",

    padding: "60px 30px",

    background: "#302E36",

    border: "1px solid #46414F",

    borderRadius: "18px",

    textAlign: "center",

    boxShadow:
      "0 12px 30px rgba(0,0,0,0.20)",
  },

  emptyIcon: {
    fontSize: "52px",
    marginBottom: "15px",
  },

  emptyTitle: {
    color: "#F5F3FF",
    margin: "0 0 10px",
  },

  emptyText: {
    color: "#A9A6B8",
    margin: 0,
  },

  /* Application List */

  applicationList: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },

  /* Card */

  card: {
    background: "#302E36",

    borderRadius: "18px",

    padding: "26px",

    border: "1px solid #46414F",

    boxShadow:
      "0 10px 28px rgba(0,0,0,0.20)",
  },

  cardHeader: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "flex-start",

    gap: "20px",

    borderBottom:
      "1px solid #46414F",

    paddingBottom: "18px",
  },

  jobTitle: {
    margin: 0,

    fontSize: "23px",

    color: "#F5F3FF",
  },

  company: {
    margin: "7px 0 0",

    color: "#A9A6B8",

    fontSize: "14px",
  },

  /* Status */

  status: {
    padding: "8px 14px",

    borderRadius: "20px",

    fontSize: "12px",

    fontWeight: "700",

    whiteSpace: "nowrap",
  },

  /* Information */

  infoGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",

    gap: "15px",

    marginTop: "20px",
  },

  infoItem: {
    display: "flex",

    alignItems: "center",

    gap: "12px",

    padding: "15px",

    borderRadius: "12px",

    background: "#3A3842",

    border: "1px solid #46414F",
  },

  infoIcon: {
    fontSize: "22px",
  },

  infoLabel: {
    display: "block",

    color: "#A9A6B8",

    fontSize: "11px",

    marginBottom: "3px",
  },

  infoValue: {
    color: "#F5F3FF",

    fontSize: "14px",
  },

  /* Cover Letter */

  coverBox: {
    marginTop: "20px",

    padding: "20px",

    borderRadius: "12px",

    background: "#3A3842",

    border:
      "1px solid #46414F",
  },

  coverTitle: {
    margin: "0 0 10px",

    color: "#C4B5FD",

    fontSize: "16px",
  },

  coverText: {
    margin: 0,

    color: "#A9A6B8",

    lineHeight: "1.6",
  },

  /* Date */

  date: {
    marginTop: "18px",

    paddingTop: "15px",

    borderTop: "1px solid #46414F",

    color: "#A9A6B8",

    fontSize: "12px",
  },

  /* Loading */

  loading: {
    minHeight: "80vh",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    color: "#F5F3FF",
  },

  loadingIcon: {
    fontSize: "45px",

    marginBottom: "12px",
  },

  loadingTitle: {
    margin: "0 0 6px",

    color: "#F5F3FF",
  },

  loadingText: {
    margin: 0,

    color: "#A9A6B8",
  },
};

export default MyApplications;