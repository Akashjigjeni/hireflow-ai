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

  const fetchMyJobs = async () => {
    try {
      const res = await API.get("/jobs/my/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Jobs Error:", err);
      alert("Failed to fetch jobs");
    }
  };

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

  useEffect(() => {
    fetchMyJobs();
    fetchStats();
  }, []);

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

  /* =========================
     BAR CHART
  ========================= */

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
          "#7C5CFC",
          "#A855F7",
          "#9B7BFF",
          "#C084FC",
          "#6D4BC4",
        ],

        borderColor: [
          "#9B7BFF",
          "#C084FC",
          "#B8A5FF",
          "#D8B4FE",
          "#8B5CF6",
        ],

        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };

  /* =========================
     PIE CHART
  ========================= */

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
          "#8B5CF6",
          "#C084FC",
          "#6D4BC4",
        ],

        borderColor: "#302E36",
        borderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  /* =========================
     BAR CHART OPTIONS
  ========================= */

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,

    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      x: {
        ticks: {
          color: "#BDB7C9",
          font: {
            size: 12,
          },
        },

        grid: {
          color: "rgba(255,255,255,0.06)",
        },
      },

      y: {
        ticks: {
          color: "#BDB7C9",
        },

        grid: {
          color: "rgba(255,255,255,0.08)",
        },
      },
    },
  };

  /* =========================
     PIE CHART OPTIONS
  ========================= */

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,

    plugins: {
      legend: {
        position: "top",

        labels: {
          color: "#D8D5E2",

          font: {
            size: 13,
          },

          padding: 18,
        },
      },
    },
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div style={styles.page}>
        <Navbar />

        <div style={styles.loading}>
          <div style={styles.loadingIcon}>
            ⏳
          </div>

          <h2 style={styles.loadingTitle}>
            Loading Dashboard...
          </h2>

          <p style={styles.loadingText}>
            Please wait...
          </p>
        </div>
      </div>
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
            <p style={styles.heroSmallText}>
              EMPLOYER WORKSPACE
            </p>

            <h1 style={styles.heroTitle}>
              Employer Dashboard
            </h1>

            <p style={styles.heroSubtitle}>
              Manage your jobs, applicants and recruitment activity.
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
            color="#7C5CFC"
          />

          <StatCard
            icon="👥"
            title="Applicants"
            value={stats.totalApplicants}
            color="#A855F7"
          />

          <StatCard
            icon="✅"
            title="Accepted"
            value={stats.accepted}
            color="#9B7BFF"
          />

          <StatCard
            icon="❌"
            title="Rejected"
            value={stats.rejected}
            color="#C084FC"
          />

          <StatCard
            icon="⏳"
            title="Pending"
            value={stats.pending}
            color="#6D4BC4"
          />

        </section>


        {/* =========================
            CHARTS
        ========================= */}

        <section style={styles.chartGrid}>

          <div style={styles.chartCard}>

            <h2 style={styles.sectionTitle}>
              📊 Recruitment Statistics
            </h2>

            <div style={styles.chart}>
              <Bar
                data={barData}
                options={chartOptions}
              />
            </div>

          </div>


          <div style={styles.chartCard}>

            <h2 style={styles.sectionTitle}>
              📈 Application Status
            </h2>

            <div style={styles.pieChart}>
              <Pie
                data={pieData}
                options={pieOptions}
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

              <p style={styles.sectionSmallText}>
                JOB MANAGEMENT
              </p>

              <h2 style={styles.jobsTitle}>
                💼 Your Posted Jobs
              </h2>

              <p style={styles.jobsSubtitle}>
                Manage and monitor your active job postings.
              </p>

            </div>


            <button
              onClick={() =>
                navigate("/post-job")
              }
              style={styles.addButton}
            >
              ＋ Add New Job
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
                Create your first job posting to start
                receiving applications.
              </p>

              <button
                onClick={() =>
                  navigate("/post-job")
                }
                style={styles.emptyButton}
              >
                ＋ Post Your First Job
              </button>

            </div>

          ) : (

            <div style={styles.jobsList}>

              {jobs.map((job) => (

                <div
                  key={job._id}
                  style={styles.jobCard}
                >

                  {/* JOB HEADER */}

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


                  {/* JOB DETAILS */}

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


                  {/* DESCRIPTION */}

                  <div style={styles.descriptionBox}>

                    <strong style={styles.descriptionTitle}>
                      📝 Job Description
                    </strong>

                    <p style={styles.descriptionText}>
                      {job.description ||
                        "No description available."}
                    </p>

                  </div>


                  {/* ACTION BUTTONS */}

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
        borderTop: `3px solid ${color}`,
      }}
    >

      <div
        style={{
          ...styles.statIcon,
          background: `${color}20`,
          border: `1px solid ${color}40`,
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
   PURPLE DARK THEME STYLES
===================================================== */

const styles = {

  /* PAGE */

  page: {
    minHeight: "100vh",

    background:
      "linear-gradient(135deg, #24232A 0%, #1F1E25 50%, #282430 100%)",

    fontFamily:
      "'Segoe UI', Arial, sans-serif",

    color: "#F5F3FF",
  },


  /* CONTAINER */

  container: {
    width:
      "min(1180px, calc(100% - 40px))",

    margin: "0 auto",

    padding: "35px 0 70px",
  },


  /* HERO */

  hero: {
    display: "flex",

    alignItems: "center",

    gap: "18px",

    padding: "28px",

    marginBottom: "25px",

    borderRadius: "18px",

    background:
      "linear-gradient(135deg, #302E36 0%, #373149 55%, #49317A 100%)",

    border:
      "1px solid #4A4555",

    boxShadow:
      "0 15px 40px rgba(0,0,0,0.30)",
  },


  heroIcon: {
    width: "64px",

    height: "64px",

    borderRadius: "16px",

    background:
      "linear-gradient(135deg, #7C5CFC, #A855F7)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "28px",

    flexShrink: 0,

    boxShadow:
      "0 8px 22px rgba(139,92,246,0.30)",
  },


  heroSmallText: {
    margin: 0,

    color: "#B8A5FF",

    fontSize: "11px",

    fontWeight: "800",

    letterSpacing: "1.5px",
  },


  heroTitle: {
    margin: "5px 0",

    fontSize: "32px",

    fontWeight: "800",

    color: "#F5F3FF",
  },


  heroSubtitle: {
    margin: 0,

    color: "#B7B1C4",

    fontSize: "14px",
  },


  /* STATISTICS */

  statsGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",

    gap: "16px",

    marginBottom: "25px",
  },


  statCard: {
    background:
      "linear-gradient(145deg, #302E36, #2B2931)",

    padding: "20px",

    borderRadius: "15px",

    border:
      "1px solid #46414F",

    display: "flex",

    alignItems: "center",

    gap: "14px",

    boxShadow:
      "0 8px 25px rgba(0,0,0,0.22)",
  },


  statIcon: {
    width: "48px",

    height: "48px",

    borderRadius: "12px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "21px",

    flexShrink: 0,
  },


  statValue: {
    margin: 0,

    fontSize: "28px",

    fontWeight: "800",

    color: "#F5F3FF",
  },


  statTitle: {
    margin: "3px 0 0",

    color: "#A9A6B8",

    fontSize: "12px",

    fontWeight: "600",
  },


  /* CHARTS */

  chartGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(350px, 1fr))",

    gap: "20px",

    marginBottom: "40px",
  },


  chartCard: {
    background:
      "linear-gradient(145deg, #302E36, #29272F)",

    padding: "22px",

    borderRadius: "17px",

    border:
      "1px solid #46414F",

    boxShadow:
      "0 8px 25px rgba(0,0,0,0.25)",
  },


  sectionTitle: {
    margin: "0 0 18px",

    textAlign: "center",

    fontSize: "18px",

    color: "#F5F3FF",

    fontWeight: "800",
  },


  chart: {
    width: "100%",
  },


  pieChart: {
    maxWidth: "320px",

    margin: "0 auto",
  },


  /* JOB SECTION */

  jobsSection: {
    marginTop: "20px",
  },


  jobsHeader: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "20px",

    marginBottom: "20px",
  },


  sectionSmallText: {
    margin: "0 0 5px",

    color: "#A78BFA",

    fontSize: "11px",

    fontWeight: "800",

    letterSpacing: "1.5px",
  },


  jobsTitle: {
    margin: 0,

    fontSize: "25px",

    fontWeight: "800",

    color: "#F5F3FF",
  },


  jobsSubtitle: {
    margin: "6px 0 0",

    color: "#A9A6B8",

    fontSize: "13px",
  },


  addButton: {
    border: "none",

    borderRadius: "10px",

    padding: "13px 19px",

    background:
      "linear-gradient(135deg, #7C5CFC, #A855F7)",

    color: "#FFFFFF",

    fontSize: "13px",

    fontWeight: "700",

    cursor: "pointer",

    boxShadow:
      "0 8px 20px rgba(139,92,246,0.30)",
  },


  jobsList: {
    display: "flex",

    flexDirection: "column",

    gap: "18px",
  },


  /* JOB CARD */

  jobCard: {
    background:
      "linear-gradient(145deg, #302E36, #29272F)",

    color: "#F5F3FF",

    padding: "24px",

    borderRadius: "17px",

    border:
      "1px solid #46414F",

    boxShadow:
      "0 8px 28px rgba(0,0,0,0.25)",
  },


  jobHeader: {
    display: "flex",

    alignItems: "center",

    gap: "14px",

    paddingBottom: "18px",

    borderBottom:
      "1px solid #46414F",
  },


  jobIcon: {
    width: "52px",

    height: "52px",

    borderRadius: "14px",

    background:
      "linear-gradient(135deg, #41365B, #332B47)",

    border:
      "1px solid #5A4A75",

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

    color: "#F5F3FF",

    fontSize: "24px",

    fontWeight: "800",

    lineHeight: "1.3",
  },


  companyName: {
    margin: "6px 0 0",

    color: "#B0AABA",

    fontSize: "15px",

    fontWeight: "600",
  },


  /* DETAILS */

  detailsGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",

    gap: "13px",

    marginTop: "18px",
  },


  detailBox: {
    display: "flex",

    alignItems: "center",

    gap: "11px",

    padding: "14px",

    borderRadius: "11px",

    background: "#25242B",

    border:
      "1px solid #403C48",
  },


  detailIcon: {
    fontSize: "21px",
  },


  detailLabel: {
    display: "block",

    color: "#8F8A9B",

    fontSize: "11px",

    marginBottom: "4px",
  },


  detailValue: {
    display: "block",

    color: "#F5F3FF",

    fontSize: "14px",

    fontWeight: "700",
  },


  /* DESCRIPTION */

  descriptionBox: {
    marginTop: "17px",

    padding: "16px",

    borderRadius: "12px",

    background: "#25242B",

    border:
      "1px solid #403C48",

    fontSize: "13px",

    lineHeight: "1.6",
  },


  descriptionTitle: {
    color: "#E8E4F0",

    display: "block",

    marginBottom: "7px",
  },


  descriptionText: {
    margin: 0,

    color: "#AAA5B5",
  },


  /* ACTION BUTTONS */

  actions: {
    display: "flex",

    flexWrap: "wrap",

    gap: "10px",

    marginTop: "20px",
  },


  editButton: {
    border:
      "1px solid #8B5CF6",

    borderRadius: "9px",

    padding: "10px 17px",

    background: "#3A2E52",

    color: "#C4B5FD",

    fontWeight: "700",

    cursor: "pointer",
  },


  deleteButton: {
    border:
      "1px solid #704A8D",

    borderRadius: "9px",

    padding: "10px 17px",

    background: "#382D42",

    color: "#D8B4FE",

    fontWeight: "700",

    cursor: "pointer",
  },


  viewButton: {
    border: "none",

    borderRadius: "9px",

    padding: "10px 17px",

    background:
      "linear-gradient(135deg, #7C5CFC, #A855F7)",

    color: "#FFFFFF",

    fontWeight: "700",

    cursor: "pointer",

    boxShadow:
      "0 5px 15px rgba(139,92,246,0.25)",
  },


  /* EMPTY STATE */

  emptyBox: {
    background:
      "linear-gradient(145deg, #302E36, #29272F)",

    padding: "55px 25px",

    borderRadius: "18px",

    border:
      "1px solid #46414F",

    textAlign: "center",

    boxShadow:
      "0 8px 28px rgba(0,0,0,0.25)",
  },


  emptyIcon: {
    fontSize: "48px",

    marginBottom: "10px",
  },


  emptyTitle: {
    color: "#F5F3FF",

    margin: "8px 0",
  },


  emptyText: {
    color: "#A9A6B8",
  },


  emptyButton: {
    marginTop: "12px",

    border: "none",

    borderRadius: "10px",

    padding: "12px 20px",

    background:
      "linear-gradient(135deg, #7C5CFC, #A855F7)",

    color: "#FFFFFF",

    fontWeight: "700",

    cursor: "pointer",
  },


  /* LOADING */

  loading: {
    minHeight: "80vh",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    background:
      "linear-gradient(135deg, #24232A, #1F1E25)",

    color: "#F5F3FF",
  },


  loadingIcon: {
    fontSize: "42px",
  },


  loadingTitle: {
    color: "#F5F3FF",

    margin: "15px 0 5px",
  },


  loadingText: {
    color: "#A9A6B8",
  },

};

export default EmployerDashboard;