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
        background: "#dcfce7",
        color: "#15803d",
      };
    }

    if (status === "Rejected") {
      return {
        background: "#fee2e2",
        color: "#dc2626",
      };
    }

    return {
      background: "#fef3c7",
      color: "#d97706",
    };
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div style={styles.loading}>
          <div style={styles.loadingIcon}>⏳</div>
          <h2>Loading Applications...</h2>
          <p>Please wait</p>
        </div>
      </>
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
            <span>📊 Total Applications</span>

            <strong>
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

            <h2>No Applications Found</h2>

            <p>
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
                      💼 {app.job.title}
                    </h2>

                    <p style={styles.company}>
                      🏢 {app.job.company}
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
                    <span>📍</span>

                    <div>
                      <small>Location</small>
                      <strong>
                        {app.job.location || "Not specified"}
                      </strong>
                    </div>
                  </div>

                  <div style={styles.infoItem}>
                    <span>💰</span>

                    <div>
                      <small>Salary</small>
                      <strong>
                        {app.job.salaryRange ||
                          "Not specified"}
                      </strong>
                    </div>
                  </div>

                </div>

                {/* Cover Letter */}
                <div style={styles.coverBox}>

                  <h3>
                    ✍️ Cover Letter
                  </h3>

                  <p>
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
    background:
      "linear-gradient(135deg, #0f172a, #172554, #312e81)",
    color: "#1e293b",
    fontFamily:
      "'Segoe UI', Arial, sans-serif",
  },

  container: {
    width: "min(1050px, calc(100% - 40px))",
    margin: "0 auto",
    padding: "45px 0 60px",
  },

  header: {
    textAlign: "center",
    color: "white",
    marginBottom: "30px",
  },

  headerIcon: {
    width: "60px",
    height: "60px",
    margin: "0 auto 12px",
    borderRadius: "16px",
    background:
      "linear-gradient(135deg, #2563eb, #7c3aed)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    boxShadow:
      "0 10px 30px rgba(37,99,235,0.35)",
  },

  title: {
    margin: 0,
    fontSize: "38px",
    fontWeight: "800",
  },

  subtitle: {
    marginTop: "8px",
    color: "#cbd5e1",
    fontSize: "14px",
  },

  countBox: {
    maxWidth: "300px",
    margin: "0 auto 25px",
    padding: "14px 20px",
    borderRadius: "12px",
    background:
      "rgba(255,255,255,0.12)",
    border:
      "1px solid rgba(255,255,255,0.2)",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backdropFilter: "blur(10px)",
  },

  emptyBox: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "60px 30px",
    background: "white",
    borderRadius: "18px",
    textAlign: "center",
    boxShadow:
      "0 15px 40px rgba(0,0,0,0.25)",
  },

  emptyIcon: {
    fontSize: "50px",
    marginBottom: "15px",
  },

  applicationList: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },

  card: {
    background: "rgba(255,255,255,0.97)",
    borderRadius: "18px",
    padding: "26px",
    boxShadow:
      "0 12px 35px rgba(0,0,0,0.25)",
    border:
      "1px solid rgba(255,255,255,0.5)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    borderBottom:
      "1px solid #e2e8f0",
    paddingBottom: "18px",
  },

  jobTitle: {
    margin: 0,
    fontSize: "23px",
    color: "#172554",
  },

  company: {
    margin:
      "7px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  status: {
    padding: "8px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

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
    gap: "10px",
    padding: "13px",
    borderRadius: "10px",
    background: "#f8fafc",
  },

  infoItemSpan: {
    fontSize: "20px",
  },

  infoItemSmall: {
    display: "block",
    color: "#64748b",
    fontSize: "10px",
  },

  coverBox: {
    marginTop: "20px",
    padding: "18px",
    borderRadius: "12px",
    background: "#f8fafc",
    border:
      "1px solid #e2e8f0",
  },

  date: {
    marginTop: "15px",
    color: "#64748b",
    fontSize: "11px",
  },

  loading: {
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },

  loadingIcon: {
    fontSize: "40px",
  },
};

export default MyApplications;