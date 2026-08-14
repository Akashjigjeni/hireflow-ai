import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function EmployerDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);

  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
  });

  const [loading, setLoading] = useState(true);

  // =========================
  // Load Dashboard
  // =========================

  useEffect(() => {
    fetchMyJobs();
    fetchStats();
  }, []);

  // =========================
  // Fetch My Jobs
  // =========================

  const fetchMyJobs = async () => {
    try {
      const res = await API.get("/jobs/my/jobs");

      setJobs(res.data);
    } catch (err) {
      console.error("Jobs Error:", err);
      alert("Failed to fetch jobs");
    }
  };

  // =========================
  // Fetch Statistics
  // =========================

  const fetchStats = async () => {
    try {
      const res = await API.get("/dashboard/stats");

      setStats(res.data);
    } catch (err) {
      console.error("Stats Error:", err);
      alert("Failed to fetch dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Delete Job
  // =========================

  const deleteJob = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/jobs/${id}`);

      alert("Job deleted successfully!");

      await fetchMyJobs();
      await fetchStats();
    } catch (err) {
      console.error("Delete Error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to delete job"
      );
    }
  };

  // =========================
  // Bar Chart
  // =========================

  const barData = {
    labels: [
      "Jobs",
      "Applicants",
      "Accepted",
      "Rejected",
      "Pending",
    ],

    datasets: [
      {
        label: "Statistics",

        data: [
          stats.totalJobs,
          stats.totalApplicants,
          stats.accepted,
          stats.rejected,
          stats.pending,
        ],

        backgroundColor: [
          "#2563eb",
          "#9333ea",
          "#16a34a",
          "#dc2626",
          "#f59e0b",
        ],

        borderRadius: 8,
      },
    ],
  };

  // =========================
  // Pie Chart
  // =========================

  const pieData = {
    labels: [
      "Accepted",
      "Rejected",
      "Pending",
    ],

    datasets: [
      {
        data: [
          stats.accepted,
          stats.rejected,
          stats.pending,
        ],

        backgroundColor: [
          "#16a34a",
          "#dc2626",
          "#f59e0b",
        ],

        borderWidth: 2,
      },
    ],
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <>
        <Navbar />

        <div style={styles.loading}>
          <div style={styles.loadingIcon}>
            ⏳
          </div>

          <h2>Loading Dashboard...</h2>

          <p>Please wait...</p>
        </div>
      </>
    );
  }

  return (
    <div style={styles.page}>
      <Navbar />

      <main style={styles.container}>

        {/* =========================
            HERO
        ========================= */}

        <section style={styles.hero}>

          <div style={styles.heroIcon}>
            🏢
          </div>

          <div>
            <h1 style={styles.heroTitle}>
              Employer Dashboard
            </h1>

            <p style={styles.heroSubtitle}>
              Manage your jobs, applicants and
              recruitment activity.
            </p>
          </div>

        </section>

        {/* =========================
            STATISTICS
        ========================= */}

        <section style={styles.statsGrid}>

          <StatCard
            icon="💼"
            title="Total Jobs"
            value={stats.totalJobs}
            color="#2563eb"
          />

          <StatCard
            icon="👥"
            title="Applicants"
            value={stats.totalApplicants}
            color="#9333ea"
          />

          <StatCard
            icon="✅"
            title="Accepted"
            value={stats.accepted}
            color="#16a34a"
          />

          <StatCard
            icon="❌"
            title="Rejected"
            value={stats.rejected}
            color="#dc2626"
          />

          <StatCard
            icon="⏳"
            title="Pending"
            value={stats.pending}
            color="#f59e0b"
          />

        </section>

        {/* =========================
            CHARTS
        ========================= */}

        <section style={styles.chartGrid}>

          {/* Bar Chart */}

          <div style={styles.chartCard}>

            <h2 style={styles.sectionTitle}>
              📊 Recruitment Statistics
            </h2>

            <div style={styles.chart}>
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,

                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>

          </div>

          {/* Pie Chart */}

          <div style={styles.chartCard}>

            <h2 style={styles.sectionTitle}>
              📈 Application Status
            </h2>

            <div style={styles.pieChart}>
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                }}
              />
            </div>

          </div>

        </section>

        {/* =========================
            JOB SECTION
        ========================= */}

        <section style={styles.jobsSection}>

          <div style={styles.jobsHeader}>

            <div>
              <h2 style={styles.jobsTitle}>
                💼 Your Posted Jobs
              </h2>

              <p style={styles.jobsSubtitle}>
                Manage your active job postings
              </p>
            </div>

            <button
              onClick={() =>
                navigate("/post-job")
              }
              style={styles.addButton}
            >
              + Add New Job
            </button>

          </div>

          {/* =========================
              NO JOBS
          ========================= */}

          {jobs.length === 0 ? (

            <div style={styles.emptyBox}>

              <div style={styles.emptyIcon}>
                📭
              </div>

              <h2 style={styles.emptyTitle}>
                No Jobs Posted Yet
              </h2>

              <p style={styles.emptyText}>
                Create your first job posting
                to start receiving applications.
              </p>

              <button
                onClick={() =>
                  navigate("/post-job")
                }
                style={styles.emptyButton}
              >
                + Post Your First Job
              </button>

            </div>

          ) : (

            /* =========================
               JOB LIST
            ========================= */

            <div style={styles.jobsList}>

              {jobs.map((job) => (

                <div
                  key={job._id}
                  style={styles.jobCard}
                >

                  {/* =========================
                      JOB HEADER
                  ========================= */}

                  <div style={styles.jobHeader}>

                    <div style={styles.jobIcon}>
                      💼
                    </div>

                    <div style={styles.jobHeading}>

                      <h2 style={styles.jobTitle}>
                        {job.title}
                      </h2>

                      <p style={styles.companyName}>
                        🏢 {job.company}
                      </p>

                    </div>

                  </div>

                  {/* =========================
                      JOB DETAILS
                  ========================= */}

                  <div style={styles.detailsGrid}>

                    <div style={styles.detailBox}>

                      <span style={styles.detailIcon}>
                        📍
                      </span>

                      <div>
                        <small style={styles.detailLabel}>
                          Location
                        </small>

                        <strong style={styles.detailValue}>
                          {job.location ||
                            "Not specified"}
                        </strong>
                      </div>

                    </div>

                    <div style={styles.detailBox}>

                      <span style={styles.detailIcon}>
                        💰
                      </span>

                      <div>
                        <small style={styles.detailLabel}>
                          Salary
                        </small>

                        <strong style={styles.detailValue}>
                          {job.salaryRange ||
                            "Not specified"}
                        </strong>
                      </div>

                    </div>

                  </div>

                  {/* =========================
                      DESCRIPTION
                  ========================= */}

                  <div style={styles.descriptionBox}>

                    <strong style={styles.descriptionTitle}>
                      📝 Job Description
                    </strong>

                    <p style={styles.descriptionText}>
                      {job.description ||
                        "No description available."}
                    </p>

                  </div>

                  {/* =========================
                      ACTION BUTTONS
                  ========================= */}

                  <div style={styles.actions}>

                    <button
                      onClick={() =>
                        navigate(
                          `/edit-job/${job._id}`
                        )
                      }
                      style={styles.editButton}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteJob(job._id)
                      }
                      style={styles.deleteButton}
                    >
                      🗑️ Delete
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/view-applicants/${job._id}`
                        )
                      }
                      style={styles.viewButton}
                    >
                      👥 View Applicants
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>
    </div>
  );
}


/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  icon,
  title,
  value,
  color,
}) {
  return (
    <div
      style={{
        ...styles.statCard,
        borderTop: `4px solid ${color}`,
      }}
    >

      <div
        style={{
          ...styles.statIcon,
          background: `${color}18`,
        }}
      >
        {icon}
      </div>

      <div>

        <h2 style={styles.statValue}>
          {value}
        </h2>

        <p style={styles.statTitle}>
          {title}
        </p>

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
      "linear-gradient(135deg, #eef4ff 0%, #f8fafc 50%, #f5f3ff 100%)",

    fontFamily:
      "'Segoe UI', Arial, sans-serif",

    color: "#172554",
  },


  container: {
    width:
      "min(1180px, calc(100% - 40px))",

    margin: "0 auto",

    padding: "35px 0 60px",
  },


  /* ================= HERO ================= */

  hero: {
    display: "flex",

    alignItems: "center",

    gap: "18px",

    padding: "25px",

    marginBottom: "25px",

    borderRadius: "18px",

    background:
      "linear-gradient(135deg, #1e3a8a, #2563eb, #7c3aed)",

    color: "white",

    boxShadow:
      "0 15px 35px rgba(37,99,235,0.25)",
  },


  heroIcon: {
    width: "62px",
    height: "62px",

    borderRadius: "16px",

    background:
      "rgba(255,255,255,0.16)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "28px",

    flexShrink: 0,
  },


  heroTitle: {
    margin: 0,

    fontSize: "30px",

    fontWeight: "800",
  },


  heroSubtitle: {
    margin: "5px 0 0",

    color:
      "rgba(255,255,255,0.85)",

    fontSize: "13px",
  },


  /* ================= STATS ================= */

  statsGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",

    gap: "15px",

    marginBottom: "25px",
  },


  statCard: {
    background: "#ffffff",

    padding: "20px",

    borderRadius: "15px",

    display: "flex",

    alignItems: "center",

    gap: "14px",

    boxShadow:
      "0 5px 20px rgba(15,23,42,0.08)",
  },


  statIcon: {
    width: "45px",
    height: "45px",

    borderRadius: "12px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "20px",

    flexShrink: 0,
  },


  statValue: {
    margin: 0,

    fontSize: "27px",

    fontWeight: "800",

    color: "#172554",
  },


  statTitle: {
    margin: "3px 0 0",

    color: "#64748b",

    fontSize: "12px",

    fontWeight: "600",
  },


  /* ================= CHARTS ================= */

  chartGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(350px, 1fr))",

    gap: "20px",

    marginBottom: "35px",
  },


  chartCard: {
    background: "#ffffff",

    padding: "22px",

    borderRadius: "16px",

    boxShadow:
      "0 5px 20px rgba(15,23,42,0.08)",
  },


  sectionTitle: {
    margin: "0 0 18px",

    textAlign: "center",

    fontSize: "17px",

    color: "#172554",

    fontWeight: "800",
  },


  chart: {
    width: "100%",
  },


  pieChart: {
    maxWidth: "320px",

    margin: "0 auto",
  },


  /* ================= JOB SECTION ================= */

  jobsSection: {
    marginTop: "35px",
  },


  jobsHeader: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "20px",

    marginBottom: "20px",
  },


  jobsTitle: {
    margin: 0,

    fontSize: "23px",

    fontWeight: "800",

    color: "#172554",
  },


  jobsSubtitle: {
    margin: "5px 0 0",

    color: "#64748b",

    fontSize: "12px",
  },


  addButton: {
    border: "none",

    borderRadius: "9px",

    padding: "12px 18px",

    background:
      "linear-gradient(135deg, #2563eb, #7c3aed)",

    color: "#ffffff",

    fontSize: "13px",

    fontWeight: "700",

    cursor: "pointer",

    boxShadow:
      "0 8px 20px rgba(37,99,235,0.2)",
  },


  jobsList: {
    display: "flex",

    flexDirection: "column",

    gap: "18px",
  },


  /* ================= JOB CARD ================= */

  jobCard: {
    background: "#ffffff",

    color: "#172554",

    padding: "24px",

    borderRadius: "16px",

    boxShadow:
      "0 7px 25px rgba(15,23,42,0.08)",

    border:
      "1px solid #e2e8f0",
  },


  jobHeader: {
    display: "flex",

    alignItems: "center",

    gap: "13px",

    paddingBottom: "17px",

    borderBottom:
      "1px solid #e2e8f0",
  },


  jobIcon: {
    width: "50px",
    height: "50px",

    borderRadius: "13px",

    background: "#eff6ff",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "23px",

    flexShrink: 0,
  },


  jobHeading: {
    minWidth: 0,
  },


  jobTitle: {
    margin: 0,

    color: "#172554",

    fontSize: "24px",

    fontWeight: "800",

    lineHeight: "1.3",
  },


  companyName: {
    margin: "6px 0 0",

    color: "#475569",

    fontSize: "16px",

    fontWeight: "600",
  },


  /* ================= DETAILS ================= */

  detailsGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",

    gap: "12px",

    marginTop: "18px",
  },


  detailBox: {
    display: "flex",

    alignItems: "center",

    gap: "10px",

    padding: "13px",

    borderRadius: "10px",

    background: "#f8fafc",

    color: "#172554",
  },


  detailIcon: {
    fontSize: "20px",
  },


  detailLabel: {
    display: "block",

    color: "#64748b",

    fontSize: "11px",

    marginBottom: "3px",
  },


  detailValue: {
    display: "block",

    color: "#172554",

    fontSize: "14px",

    fontWeight: "700",
  },


  /* ================= DESCRIPTION ================= */

  descriptionBox: {
    marginTop: "17px",

    padding: "15px",

    borderRadius: "11px",

    background: "#f8fafc",

    color: "#475569",

    fontSize: "13px",

    lineHeight: "1.6",
  },


  descriptionTitle: {
    color: "#172554",

    display: "block",

    marginBottom: "6px",
  },


  descriptionText: {
    margin: 0,

    color: "#475569",
  },


  /* ================= BUTTONS ================= */

  actions: {
    display: "flex",

    flexWrap: "wrap",

    gap: "10px",

    marginTop: "20px",
  },


  editButton: {
    border: "none",

    borderRadius: "8px",

    padding: "10px 17px",

    background: "#f59e0b",

    color: "#ffffff",

    fontWeight: "700",

    cursor: "pointer",
  },


  deleteButton: {
    border: "none",

    borderRadius: "8px",

    padding: "10px 17px",

    background: "#dc2626",

    color: "#ffffff",

    fontWeight: "700",

    cursor: "pointer",
  },


  viewButton: {
    border: "none",

    borderRadius: "8px",

    padding: "10px 17px",

    background:
      "linear-gradient(135deg, #2563eb, #4f46e5)",

    color: "#ffffff",

    fontWeight: "700",

    cursor: "pointer",

    boxShadow:
      "0 5px 15px rgba(37,99,235,0.2)",
  },


  /* ================= EMPTY ================= */

  emptyBox: {
    background: "#ffffff",

    padding: "55px 25px",

    borderRadius: "17px",

    textAlign: "center",

    boxShadow:
      "0 7px 25px rgba(15,23,42,0.08)",
  },


  emptyIcon: {
    fontSize: "45px",

    marginBottom: "8px",
  },


  emptyTitle: {
    color: "#172554",

    margin: "8px 0",
  },


  emptyText: {
    color: "#64748b",
  },


  emptyButton: {
    marginTop: "10px",

    border: "none",

    borderRadius: "9px",

    padding: "11px 18px",

    background:
      "linear-gradient(135deg, #2563eb, #7c3aed)",

    color: "#ffffff",

    fontWeight: "700",

    cursor: "pointer",
  },


  /* ================= LOADING ================= */

  loading: {
    minHeight: "80vh",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    color: "#172554",
  },


  loadingIcon: {
    fontSize: "40px",
  },
};

export default EmployerDashboard;