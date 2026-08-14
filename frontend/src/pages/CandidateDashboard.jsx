import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";

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

function CandidateDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalApplications: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
    savedJobs: 0,
    recentApplications: [],
  });

  const [recommendedJobs, setRecommendedJobs] =
    useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecommendedJobs();
  }, []);

  // =========================
  // Fetch Candidate Stats
  // =========================

  const fetchStats = async () => {
    try {
      const res = await API.get(
        "/candidate-dashboard/stats"
      );

      setStats(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Fetch Recommended Jobs
  // =========================

  const fetchRecommendedJobs = async () => {
    try {
      const res = await API.get(
        "/jobs/recommended"
      );

      setRecommendedJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // Charts
  // =========================

  const barData = {
    labels: [
      "Applications",
      "Accepted",
      "Rejected",
      "Pending",
      "Saved Jobs",
    ],

    datasets: [
      {
        label: "My Statistics",

        data: [
          stats.totalApplications,
          stats.accepted,
          stats.rejected,
          stats.pending,
          stats.savedJobs,
        ],

        backgroundColor: [
          "#2563eb",
          "#16a34a",
          "#dc2626",
          "#f59e0b",
          "#9333ea",
        ],

        borderRadius: 7,
      },
    ],
  };

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
          <p>Please wait</p>
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
            👤
          </div>

          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              Candidate Dashboard
            </h1>

            <p style={styles.heroSubtitle}>
              Welcome back! Track your applications
              and discover your next opportunity.
            </p>
          </div>

        </section>


        {/* =========================
            STATISTICS
        ========================= */}

        <section style={styles.statsGrid}>

          <StatCard
            icon="📄"
            title="Applications"
            value={stats.totalApplications}
            color="#2563eb"
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

          <StatCard
            icon="❤️"
            title="Saved Jobs"
            value={stats.savedJobs}
            color="#9333ea"
          />

        </section>


        {/* =========================
            CHARTS
        ========================= */}

        <section style={styles.chartGrid}>

          <div style={styles.chartCard}>

            <h2 style={styles.sectionTitle}>
              📊 Application Statistics
            </h2>

            <div style={styles.barChartWrap}>
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,

                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>

          </div>


          <div style={styles.chartCard}>

            <h2 style={styles.sectionTitle}>
              📈 Application Status
            </h2>

            <div style={styles.pieChartWrap}>
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>

          </div>

        </section>


        {/* =========================
            AI RECOMMENDED JOBS
        ========================= */}

        <section style={styles.section}>

          <div style={styles.sectionHeader}>

            <div style={styles.sectionHeadingBlock}>

              <h2 style={styles.mainSectionTitle}>
                ⭐ AI Recommended Jobs
              </h2>

              <p style={styles.sectionSubtitle}>
                Jobs matched with your skills
              </p>

            </div>

          </div>


          {recommendedJobs.length > 0 ? (

            <div style={styles.jobsGrid}>

              {recommendedJobs.map((job) => (

                <div
                  key={job._id}
                  style={styles.jobCard}
                >

                  <div style={styles.jobTop}>

                    <div style={styles.jobIcon}>
                      💼
                    </div>

                    <div style={styles.jobHeading}>
                      <h3 style={styles.jobTitle}>
                        {job.title}
                      </h3>

                      <p style={styles.company}>
                        🏢 {job.company}
                      </p>
                    </div>

                  </div>


                  <div style={styles.jobDetails}>

                    <div style={styles.jobDetailBox}>
                      <small>
                        Location
                      </small>

                      <strong>
                        📍 {job.location}
                      </strong>
                    </div>

                    <div style={styles.jobDetailBox}>
                      <small>
                        Salary
                      </small>

                      <strong>
                        💰 {job.salaryRange}
                      </strong>
                    </div>

                  </div>


                  {/* Match Score */}

                  <div style={styles.matchBox}>

                    <div style={styles.matchHeader}>

                      <strong>
                        🎯 Match Score
                      </strong>

                      <strong
                        style={{
                          color:
                            job.score >= 80
                              ? "#16a34a"
                              : job.score >= 50
                                ? "#d97706"
                                : "#dc2626",
                        }}
                      >
                        {job.score || 0}%
                      </strong>

                    </div>

                    <div
                      style={styles.progressBackground}
                    >
                      <div
                        style={{
                          ...styles.progress,
                          width: `${Math.min(
                            job.score || 0,
                            100
                          )}%`,
                        }}
                      />
                    </div>

                  </div>


                  {/* Skills */}

                  <div style={styles.skillsBox}>

                    <strong>
                      ✅ Matched Skills
                    </strong>

                    <div style={styles.skills}>

                      {job.matchedSkills?.length > 0 ? (

                        job.matchedSkills.map(
                          (skill, index) => (
                            <span
                              key={index}
                              style={styles.skill}
                            >
                              {skill}
                            </span>
                          )
                        )

                      ) : (

                        <span style={styles.noSkills}>
                          No matched skills
                        </span>

                      )}

                    </div>

                  </div>


                  <button
                    onClick={() =>
                      navigate(
                        `/apply/${job._id}`
                      )
                    }
                    style={styles.applyButton}
                  >
                    🚀 Apply Now
                  </button>

                </div>

              ))}

            </div>

          ) : (

            <div style={styles.emptyBox}>

              <div style={styles.emptyIcon}>
                🔍
              </div>

              <h3>
                No Recommended Jobs Yet
              </h3>

              <p>
                Complete your profile and add
                skills to get better recommendations.
              </p>

            </div>

          )}

        </section>


        {/* =========================
            RECENT APPLICATIONS
        ========================= */}

        <section style={styles.section}>

          <div style={styles.sectionHeader}>

            <div style={styles.sectionHeadingBlock}>

              <h2 style={styles.mainSectionTitle}>
                📋 Recent Applications
              </h2>

              <p style={styles.sectionSubtitle}>
                Track your latest job applications
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/my-applications")
              }
              style={styles.viewAllButton}
            >
              View All →
            </button>

          </div>


          {stats.recentApplications &&
            stats.recentApplications.length > 0 ? (

            <div style={styles.applicationList}>

              {stats.recentApplications.map(
                (application) => {

                  const status =
                    application.status;

                  const statusStyle =
                    status === "Accepted"
                      ? styles.accepted
                      : status === "Rejected"
                        ? styles.rejected
                        : styles.pending;

                  return (
                    <div
                      key={application._id}
                      style={styles.applicationCard}
                    >

                      <div style={styles.applicationIcon}>
                        💼
                      </div>

                      <div
                        style={
                          styles.applicationInfo
                        }
                      >

                        <h3>
                          {application.job?.title ||
                            "Job"}
                        </h3>

                        <p>
                          🏢{" "}
                          {application.job?.company ||
                            "Company"}
                        </p>

                        <small>
                          📅 Applied on{" "}
                          {application.createdAt
                            ? new Date(
                              application.createdAt
                            ).toLocaleDateString()
                            : "N/A"}
                        </small>

                      </div>


                      <div
                        style={{
                          ...styles.status,
                          ...statusStyle,
                        }}
                      >
                        {status === "Accepted"
                          ? "✓ Accepted"
                          : status === "Rejected"
                            ? "✕ Rejected"
                            : "⏳ Pending"}
                      </div>

                    </div>
                  );
                }
              )}

            </div>

          ) : (

            <div style={styles.emptyBox}>

              <div style={styles.emptyIcon}>
                📭
              </div>

              <h3>
                No Applications Yet
              </h3>

              <p>
                Apply for jobs to see your
                applications here.
              </p>

            </div>

          )}

        </section>

      </main>

      <style>{`

        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        .candidate-dashboard-page {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }

        @media (max-width: 900px) {
          .candidate-dashboard-container {
            width: calc(100% - 30px) !important;
          }
        }

        @media (max-width: 600px) {

          .candidate-dashboard-container {
            width: calc(100% - 20px) !important;
            padding-top: 20px !important;
            padding-bottom: 35px !important;
          }

          .candidate-dashboard-hero {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 13px !important;
            padding: 20px !important;
          }

          .candidate-dashboard-hero-icon {
            width: 50px !important;
            height: 50px !important;
            font-size: 23px !important;
          }

          .candidate-dashboard-hero-title {
            font-size: 24px !important;
            line-height: 1.2 !important;
          }

          .candidate-dashboard-hero-subtitle {
            font-size: 11px !important;
            line-height: 1.5 !important;
          }

          .candidate-stats-grid {
            grid-template-columns: 1fr !important;
          }

          .candidate-chart-grid {
            grid-template-columns: 1fr !important;
          }

          .candidate-chart-card {
            min-width: 0 !important;
            padding: 15px !important;
          }

          .candidate-bar-chart {
            height: 220px !important;
          }

          .candidate-pie-chart {
            height: 220px !important;
          }

          .candidate-section-header {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .candidate-jobs-grid {
            grid-template-columns: 1fr !important;
          }

          .candidate-job-card {
            min-width: 0 !important;
            width: 100% !important;
            padding: 16px !important;
          }

          .candidate-job-details {
            grid-template-columns: 1fr !important;
          }

          .candidate-job-title {
            font-size: 17px !important;
            word-break: break-word !important;
          }

          .candidate-application-card {
            flex-wrap: wrap !important;
          }

          .candidate-application-info {
            min-width: 0 !important;
            width: calc(100% - 58px) !important;
          }

          .candidate-status {
            margin-left: 58px !important;
          }

        }

        @media (max-width: 380px) {

          .candidate-dashboard-container {
            width: calc(100% - 14px) !important;
          }

          .candidate-dashboard-hero {
            padding: 16px !important;
          }

          .candidate-dashboard-hero-title {
            font-size: 21px !important;
          }

          .candidate-stat-card {
            padding: 16px !important;
          }

          .candidate-main-title {
            font-size: 19px !important;
          }

        }

      `}</style>

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
      className="candidate-stat-card"
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

      <div style={styles.statText}>

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
    width: "100%",
    maxWidth: "100%",
    minHeight: "100vh",
    overflowX: "hidden",

    background:
      "linear-gradient(135deg,#eef4ff,#f8fafc,#f5f3ff)",

    fontFamily:
      "'Segoe UI', Arial, sans-serif",

    color: "#172554",
  },


  container: {
    width:
      "min(1180px, calc(100% - 40px))",

    maxWidth: "100%",

    margin: "0 auto",

    padding: "35px 0 60px",

    minWidth: 0,
  },


  /* HERO */

  hero: {
    display: "flex",

    alignItems: "center",

    gap: "18px",

    padding: "25px",

    marginBottom: "25px",

    borderRadius: "18px",

    background:
      "linear-gradient(135deg,#1e3a8a,#2563eb,#7c3aed)",

    color: "white",

    boxShadow:
      "0 15px 35px rgba(37,99,235,0.25)",

    minWidth: 0,

    overflow: "hidden",
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


  heroContent: {
    minWidth: 0,
    flex: 1,
  },


  heroTitle: {
    margin: 0,

    fontSize: "30px",

    fontWeight: "800",

    overflowWrap: "break-word",
  },


  heroSubtitle: {
    margin: "5px 0 0",

    color:
      "rgba(255,255,255,0.82)",

    fontSize: "13px",

    lineHeight: 1.5,

    overflowWrap: "break-word",
  },


  /* STATS */

  statsGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(180px,1fr))",

    gap: "15px",

    marginBottom: "25px",

    minWidth: 0,
  },


  statCard: {
    background: "white",

    padding: "20px",

    borderRadius: "15px",

    display: "flex",

    alignItems: "center",

    gap: "14px",

    boxShadow:
      "0 5px 20px rgba(15,23,42,0.08)",

    minWidth: 0,
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


  statText: {
    minWidth: 0,
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


  /* CHARTS */

  chartGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(2,minmax(0,1fr))",

    gap: "20px",

    marginBottom: "35px",

    minWidth: 0,
  },


  chartCard: {
    background: "white",

    padding: "22px",

    borderRadius: "16px",

    boxShadow:
      "0 5px 20px rgba(15,23,42,0.08)",

    minWidth: 0,

    overflow: "hidden",
  },


  sectionTitle: {
    margin: "0 0 16px",

    textAlign: "center",

    fontSize: "17px",

    color: "#172554",
  },


  barChartWrap: {
    width: "100%",

    height: "270px",

    position: "relative",
  },


  pieChartWrap: {
    width: "100%",

    maxWidth: "300px",

    height: "270px",

    margin: "0 auto",

    position: "relative",
  },


  /* SECTIONS */

  section: {
    marginTop: "35px",

    minWidth: 0,
  },


  sectionHeader: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "15px",

    marginBottom: "18px",

    minWidth: 0,
  },


  sectionHeadingBlock: {
    minWidth: 0,
  },


  mainSectionTitle: {
    margin: 0,

    fontSize: "22px",

    fontWeight: "800",

    color: "#172554",

    overflowWrap: "break-word",
  },


  sectionSubtitle: {
    margin: "5px 0 0",

    color: "#64748b",

    fontSize: "12px",
  },


  viewAllButton: {
    border: "none",

    background: "#eff6ff",

    color: "#2563eb",

    padding: "9px 14px",

    borderRadius: "8px",

    fontWeight: "700",

    cursor: "pointer",

    flexShrink: 0,
  },


  /* JOBS */

  jobsGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(320px,1fr))",

    gap: "20px",

    minWidth: 0,
  },


  jobCard: {
    background: "white",

    padding: "22px",

    borderRadius: "16px",

    boxShadow:
      "0 7px 25px rgba(15,23,42,0.09)",

    border:
      "1px solid #e2e8f0",

    minWidth: 0,

    overflow: "hidden",
  },


  jobTop: {
    display: "flex",

    alignItems: "center",

    gap: "12px",

    minWidth: 0,
  },


  jobIcon: {
    width: "48px",
    height: "48px",

    borderRadius: "12px",

    background: "#eff6ff",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "22px",

    flexShrink: 0,
  },


  jobHeading: {
    minWidth: 0,

    flex: 1,
  },


  jobTitle: {
    margin: 0,

    fontSize: "18px",

    color: "#172554",

    wordBreak: "break-word",
  },


  company: {
    margin: "4px 0 0",

    color: "#64748b",

    fontSize: "12px",

    wordBreak: "break-word",
  },


  jobDetails: {
    display: "grid",

    gridTemplateColumns:
      "repeat(2,minmax(0,1fr))",

    gap: "8px",

    marginTop: "16px",

    minWidth: 0,
  },


  jobDetailBox: {
    background: "#f8fafc",

    borderRadius: "9px",

    padding: "10px",

    minWidth: 0,
  },


  matchBox: {
    marginTop: "18px",

    padding: "13px",

    background: "#f8fafc",

    borderRadius: "10px",
  },


  matchHeader: {
    display: "flex",

    justifyContent: "space-between",

    gap: "10px",

    fontSize: "12px",

    marginBottom: "8px",
  },


  progressBackground: {
    height: "7px",

    background: "#e2e8f0",

    borderRadius: "20px",

    overflow: "hidden",
  },


  progress: {
    height: "100%",

    borderRadius: "20px",

    background:
      "linear-gradient(90deg,#2563eb,#7c3aed)",

    transition:
      "width 0.4s ease",
  },


  skillsBox: {
    marginTop: "15px",

    fontSize: "12px",
  },


  skills: {
    display: "flex",

    flexWrap: "wrap",

    gap: "6px",

    marginTop: "8px",
  },


  skill: {
    padding: "5px 9px",

    borderRadius: "15px",

    background: "#eff6ff",

    color: "#2563eb",

    fontSize: "10px",

    fontWeight: "600",

    maxWidth: "100%",

    overflowWrap: "break-word",
  },


  noSkills: {
    color: "#64748b",

    fontSize: "12px",
  },


  applyButton: {
    width: "100%",

    marginTop: "18px",

    height: "43px",

    border: "none",

    borderRadius: "9px",

    background:
      "linear-gradient(135deg,#2563eb,#7c3aed)",

    color: "white",

    fontWeight: "700",

    cursor: "pointer",

    fontSize: "13px",
  },


  /* APPLICATIONS */

  applicationList: {
    display: "flex",

    flexDirection: "column",

    gap: "12px",

    minWidth: 0,
  },


  applicationCard: {
    background: "white",

    padding: "17px",

    borderRadius: "14px",

    display: "flex",

    alignItems: "center",

    gap: "13px",

    boxShadow:
      "0 5px 18px rgba(15,23,42,0.07)",

    border:
      "1px solid #e2e8f0",

    minWidth: 0,

    overflow: "hidden",
  },


  applicationIcon: {
    width: "45px",
    height: "45px",

    borderRadius: "11px",

    background: "#eff6ff",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "20px",

    flexShrink: 0,
  },


  applicationInfo: {
    flex: 1,

    minWidth: 0,

    overflow: "hidden",
  },


  status: {
    padding: "7px 12px",

    borderRadius: "20px",

    fontSize: "11px",

    fontWeight: "700",

    whiteSpace: "nowrap",

    flexShrink: 0,
  },


  accepted: {
    background: "#dcfce7",

    color: "#15803d",
  },


  rejected: {
    background: "#fee2e2",

    color: "#dc2626",
  },


  pending: {
    background: "#fef3c7",

    color: "#d97706",
  },


  /* EMPTY */

  emptyBox: {
    background: "white",

    padding: "45px 25px",

    borderRadius: "16px",

    textAlign: "center",

    boxShadow:
      "0 5px 20px rgba(15,23,42,0.07)",

    overflow: "hidden",
  },


  emptyIcon: {
    fontSize: "42px",

    marginBottom: "8px",
  },


  /* LOADING */

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

export default CandidateDashboard;