import { useState, useEffect } from "react";
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
  const [stats, setStats] = useState({
    totalApplications: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
    savedJobs: 0,
    recentApplications: [],
  });

  const [recommendedJobs, setRecommendedJobs] = useState([]);

  const fetchStats = async () => {
    try {
      const res = await API.get("/candidate-dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load dashboard");
    }
  };

  const fetchRecommendedJobs = async () => {
    try {
      const res = await API.get("/jobs/recommended");
      setRecommendedJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRecommendedJobs();
  }, []);

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
        label: "Statistics",
        data: [
          stats.totalApplications,
          stats.accepted,
          stats.rejected,
          stats.pending,
          stats.savedJobs,
        ],
        backgroundColor: [
          "#8B5CF6",
          "#22C55E",
          "#EF4444",
          "#F59E0B",
          "#A855F7",
        ],
        borderRadius: 8,
      },
    ],
  };

  const pieData = {
    labels: ["Accepted", "Rejected", "Pending"],
    datasets: [
      {
        data: [
          stats.accepted,
          stats.rejected,
          stats.pending,
        ],
        backgroundColor: [
          "#22C55E",
          "#EF4444",
          "#A855F7",
        ],
        borderColor: "#302E36",
        borderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#F5F3FF",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#A9A6B8",
        },
        grid: {
          color: "#46414F",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#A9A6B8",
        },
        grid: {
          color: "#46414F",
        },
      },
    },
  };

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        <div style={styles.container}>

          {/* HEADER */}

          <div style={styles.header}>
            <p style={styles.welcome}>
              WELCOME BACK 👋
            </p>

            <h1 style={styles.title}>
              Candidate Dashboard
            </h1>

            <p style={styles.subtitle}>
              Track your applications, job opportunities and career progress.
            </p>
          </div>

          {/* STATISTICS */}

          <div style={styles.statsGrid}>
            <StatCard
              icon="📄"
              title="Applications"
              value={stats.totalApplications}
              color="#8B5CF6"
            />

            <StatCard
              icon="✅"
              title="Accepted"
              value={stats.accepted}
              color="#22C55E"
            />

            <StatCard
              icon="❌"
              title="Rejected"
              value={stats.rejected}
              color="#EF4444"
            />

            <StatCard
              icon="⏳"
              title="Pending"
              value={stats.pending}
              color="#F59E0B"
            />

            <StatCard
              icon="❤️"
              title="Saved Jobs"
              value={stats.savedJobs}
              color="#A855F7"
            />
          </div>

          {/* CHARTS */}

          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                Your Progress
              </h2>

              <p style={styles.sectionSubtitle}>
                Overview of your job applications and application status.
              </p>
            </div>
          </div>

          <div style={styles.chartGrid}>
            <div style={styles.chartCard}>
              <h2 style={styles.chartTitle}>
                Application Statistics
              </h2>

              <Bar
                data={barData}
                options={chartOptions}
              />
            </div>

            <div style={styles.chartCard}>
              <h2 style={styles.chartTitle}>
                Application Status
              </h2>

              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      labels: {
                        color: "#F5F3FF",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* AI RECOMMENDED JOBS */}

          <div style={styles.jobsSection}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>
                  ⭐ AI Recommended Jobs
                </h2>

                <p style={styles.sectionSubtitle}>
                  Jobs recommended based on your profile.
                </p>
              </div>
            </div>

            {recommendedJobs.length > 0 ? (
              recommendedJobs.map((job) => (
                <div
                  key={job._id}
                  style={styles.jobCard}
                >
                  <div style={styles.jobTop}>
                    <div>
                      <h2 style={styles.jobTitle}>
                        {job.title}
                      </h2>

                      <p style={styles.company}>
                        🏢 {job.company}
                      </p>
                    </div>

                    <div style={styles.scoreBox}>
                      {job.score}%
                      <span>Match</span>
                    </div>
                  </div>

                  <div style={styles.jobInfo}>
                    <span>
                      📍 {job.location}
                    </span>

                    <span>
                      💰 {job.salaryRange}
                    </span>
                  </div>

                  <p style={styles.skills}>
                    <strong>✅ Matched Skills:</strong>{" "}
                    {job.matchedSkills?.length > 0
                      ? job.matchedSkills.join(", ")
                      : "None"}
                  </p>

                  <button style={styles.applyButton}>
                    Apply Now
                  </button>
                </div>
              ))
            ) : (
              <div style={styles.emptyCard}>
                <div style={styles.emptyIcon}>
                  💼
                </div>

                <h3 style={styles.emptyTitle}>
                  No Recommended Jobs Yet
                </h3>

                <p style={styles.emptyText}>
                  New job recommendations will appear here.
                </p>
              </div>
            )}
          </div>

          {/* RECENT APPLICATIONS */}

          <div style={styles.jobsSection}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>
                  Recent Applications
                </h2>

                <p style={styles.sectionSubtitle}>
                  Track the latest jobs you have applied for.
                </p>
              </div>
            </div>

            {stats.recentApplications &&
            stats.recentApplications.length > 0 ? (
              stats.recentApplications.map(
                (application) => (
                  <div
                    key={application._id}
                    style={styles.applicationCard}
                  >
                    <div>
                      <h2 style={styles.jobTitle}>
                        {application.job?.title}
                      </h2>

                      <p style={styles.company}>
                        🏢 {application.job?.company}
                      </p>

                      <div style={styles.jobInfo}>
                        <span>
                          📍 {application.job?.location}
                        </span>

                        <span>
                          📅{" "}
                          {new Date(
                            application.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <StatusBadge
                      status={application.status}
                    />
                  </div>
                )
              )
            ) : (
              <div style={styles.emptyCard}>
                <div style={styles.emptyIcon}>
                  📄
                </div>

                <h3 style={styles.emptyTitle}>
                  No Applications Yet
                </h3>

                <p style={styles.emptyText}>
                  Apply for jobs to see your applications here.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}


/* =========================
   STAT CARD
========================= */

function StatCard({
  icon,
  title,
  value,
  color,
}) {
  return (
    <div style={styles.statCard}>
      <div
        style={{
          ...styles.statIcon,
          background: `${color}25`,
          border: `1px solid ${color}55`,
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


/* =========================
   STATUS BADGE
========================= */

function StatusBadge({ status }) {
  const currentStatus =
    status?.toLowerCase() || "pending";

  let style = styles.pendingStatus;

  if (currentStatus === "accepted") {
    style = styles.acceptedStatus;
  }

  if (currentStatus === "rejected") {
    style = styles.rejectedStatus;
  }

  return (
    <span style={style}>
      ● {status || "Pending"}
    </span>
  );
}


/* =========================
   STYLES
========================= */

const styles = {

  page: {
    minHeight: "100vh",
    background: "#24232A",
    color: "#F5F3FF",
    padding: "40px 20px 80px",
  },

  container: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  header: {
    marginBottom: "40px",
  },

  welcome: {
    margin: 0,
    color: "#A78BFA",
    fontSize: "13px",
    fontWeight: "800",
    letterSpacing: "1.5px",
  },

  title: {
    margin: "8px 0",
    color: "#F5F3FF",
    fontSize: "42px",
    fontWeight: "800",
  },

  subtitle: {
    margin: 0,
    color: "#A9A6B8",
    fontSize: "16px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "18px",
    marginBottom: "50px",
  },

  statCard: {
    background: "#302E36",
    border: "1px solid #46414F",
    borderRadius: "16px",
    padding: "22px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.18)",
  },

  statIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },

  statValue: {
    margin: 0,
    color: "#F5F3FF",
    fontSize: "28px",
    fontWeight: "800",
  },

  statTitle: {
    margin: "3px 0 0",
    color: "#A9A6B8",
    fontSize: "14px",
  },

  sectionHeader: {
    marginBottom: "20px",
  },

  sectionTitle: {
    margin: 0,
    color: "#F5F3FF",
    fontSize: "25px",
  },

  sectionSubtitle: {
    margin: "6px 0 0",
    color: "#A9A6B8",
    fontSize: "14px",
  },

  chartGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(420px, 1fr))",
    gap: "24px",
    marginBottom: "60px",
  },

  chartCard: {
    background: "#302E36",
    border: "1px solid #46414F",
    padding: "25px",
    borderRadius: "16px",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.18)",
  },

  chartTitle: {
    textAlign: "center",
    margin: "0 0 25px",
    color: "#F5F3FF",
    fontSize: "20px",
  },

  jobsSection: {
    marginTop: "60px",
  },

  jobCard: {
    background: "#302E36",
    border: "1px solid #46414F",
    padding: "25px",
    borderRadius: "16px",
    marginBottom: "18px",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.18)",
  },

  jobTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    alignItems: "flex-start",
  },

  jobTitle: {
    margin: 0,
    color: "#F5F3FF",
    fontSize: "21px",
  },

  company: {
    margin: "7px 0 0",
    color: "#A9A6B8",
  },

  jobInfo: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginTop: "18px",
    color: "#A9A6B8",
    fontSize: "14px",
  },

  scoreBox: {
    minWidth: "75px",
    textAlign: "center",
    padding: "10px",
    borderRadius: "12px",
    background: "#3A2E52",
    border: "1px solid #6D4BC4",
    color: "#C4B5FD",
    fontWeight: "800",
    fontSize: "18px",
  },

  skills: {
    marginTop: "18px",
    color: "#A9A6B8",
  },

  applyButton: {
    marginTop: "20px",
    padding: "12px 24px",
    background:
      "linear-gradient(135deg, #8B5CF6, #A855F7)",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow:
      "0 6px 18px rgba(139,92,246,0.25)",
  },

  applicationCard: {
    background: "#302E36",
    border: "1px solid #46414F",
    padding: "25px",
    borderRadius: "16px",
    marginBottom: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.18)",
  },

  acceptedStatus: {
    padding: "8px 14px",
    borderRadius: "20px",
    background: "rgba(34,197,94,0.15)",
    border: "1px solid rgba(34,197,94,0.4)",
    color: "#4ADE80",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  rejectedStatus: {
    padding: "8px 14px",
    borderRadius: "20px",
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.4)",
    color: "#FCA5A5",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  pendingStatus: {
    padding: "8px 14px",
    borderRadius: "20px",
    background: "rgba(168,85,247,0.15)",
    border: "1px solid rgba(168,85,247,0.4)",
    color: "#C4B5FD",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  emptyCard: {
    background: "#302E36",
    border: "1px solid #46414F",
    borderRadius: "16px",
    padding: "45px 25px",
    textAlign: "center",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.18)",
  },

  emptyIcon: {
    fontSize: "42px",
    marginBottom: "10px",
  },

  emptyTitle: {
    margin: "5px 0",
    color: "#F5F3FF",
  },

  emptyText: {
    margin: 0,
    color: "#A9A6B8",
  },
};

export default CandidateDashboard;