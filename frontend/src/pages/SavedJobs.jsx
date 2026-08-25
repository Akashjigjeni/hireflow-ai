import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function SavedJobs() {
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);

      const res = await API.get("/saved-jobs");

      setSavedJobs(res.data);
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to load saved jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const removeJob = async (jobId) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this job from Saved Jobs?"
    );

    if (!confirmRemove) return;

    try {
      await API.delete(`/saved-jobs/${jobId}`);

      await fetchSavedJobs();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to remove job"
      );
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <Navbar />

        <div style={styles.loadingPage}>
          <div style={styles.spinner}>❤️</div>

          <h2 style={styles.loadingTitle}>
            Loading Saved Jobs
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

        {/* HEADER */}
        <section style={styles.hero}>

          <div style={styles.heroLeft}>

            <div style={styles.heartCircle}>
              ❤️
            </div>

            <div>
              <h1 style={styles.heroTitle}>
                Saved Jobs
              </h1>

              <p style={styles.heroSubtitle}>
                Keep track of opportunities you're interested in.
              </p>
            </div>

          </div>

          <div style={styles.savedCount}>
            <span style={styles.countNumber}>
              {savedJobs.length}
            </span>

            <span style={styles.countText}>
              {savedJobs.length === 1
                ? "Saved Job"
                : "Saved Jobs"}
            </span>
          </div>

        </section>


        {/* EMPTY STATE */}
        {savedJobs.length === 0 ? (

          <section style={styles.emptyCard}>

            <div style={styles.emptyIllustration}>
              ❤️
            </div>

            <h2 style={styles.emptyTitle}>
              No Saved Jobs Yet
            </h2>

            <p style={styles.emptyText}>
              Found a job you like?
              <br />
              Save it here and come back to it whenever you're ready.
            </p>

            <button
              onClick={() => navigate("/jobs")}
              style={styles.browseButton}
            >
              🔎 Browse Available Jobs
            </button>

          </section>

        ) : (

          <section>

            <div style={styles.sectionHeader}>

              <h2 style={styles.sectionTitle}>
                Your Saved Opportunities
              </h2>

              <p style={styles.sectionSubtitle}>
                Review and apply to jobs you've saved.
              </p>

            </div>


            <div style={styles.jobsGrid}>

              {savedJobs.map((item) => {

                const job = item.job;

                if (!job) return null;

                return (
                  <article
                    key={item._id}
                    style={styles.jobCard}
                  >

                    {/* JOB TOP */}
                    <div style={styles.jobTop}>

                      <div style={styles.companyIcon}>
                        💼
                      </div>

                      <div style={styles.jobHeading}>

                        <h2 style={styles.jobTitle}>
                          {job.title}
                        </h2>

                        <p style={styles.company}>
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
                            {job.location || "Not specified"}
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
                            {job.salaryRange || "Not specified"}
                          </strong>
                        </div>

                      </div>

                    </div>


                    {/* DESCRIPTION */}
                    {job.description && (

                      <div style={styles.description}>

                        <h4 style={styles.descriptionTitle}>
                          📝 Job Description
                        </h4>

                        <p style={styles.descriptionText}>
                          {job.description}
                        </p>

                      </div>

                    )}


                    {/* ACTIONS */}
                    <div style={styles.actions}>

                      <button
                        onClick={() =>
                          navigate(`/apply/${job._id}`)
                        }
                        style={styles.applyButton}
                      >
                        🚀 Apply Now
                      </button>

                      <button
                        onClick={() =>
                          removeJob(job._id)
                        }
                        style={styles.removeButton}
                      >
                        🗑 Remove
                      </button>

                    </div>

                  </article>
                );
              })}

            </div>

          </section>

        )}

      </main>
    </div>
  );
}


/* =====================================================
   DARK PURPLE THEME STYLES
===================================================== */

const styles = {

  page: {
    minHeight: "100vh",
    background: "#24232A",
    color: "#F5F3FF",
    fontFamily:
      "system-ui, 'Segoe UI', Roboto, Arial, sans-serif",
    paddingBottom: "50px",
  },

  container: {
    width: "min(1200px, calc(100% - 50px))",
    margin: "0 auto",
    paddingTop: "35px",
  },


  /* HERO */

  hero: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",

    padding: "28px 32px",

    borderRadius: "20px",

    background: "#302E36",

    border: "1px solid #46414F",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.22)",

    marginBottom: "28px",
  },

  heroLeft: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  heartCircle: {
    width: "62px",
    height: "62px",

    borderRadius: "16px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    background:
      "linear-gradient(135deg, #8B5CF6, #A855F7)",

    fontSize: "30px",

    boxShadow:
      "0 8px 20px rgba(139,92,246,0.25)",
  },

  heroTitle: {
    margin: 0,

    fontSize: "34px",

    fontWeight: "800",

    color: "#F5F3FF",
  },

  heroSubtitle: {
    margin: "6px 0 0",

    fontSize: "14px",

    color: "#A9A6B8",
  },

  savedCount: {
    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    minWidth: "110px",

    padding: "12px 18px",

    borderRadius: "14px",

    background: "#3A3842",

    border: "1px solid #5B5663",
  },

  countNumber: {
    fontSize: "27px",

    fontWeight: "800",

    color: "#C4B5FD",
  },

  countText: {
    fontSize: "11px",

    color: "#A9A6B8",
  },


  /* EMPTY STATE */

  emptyCard: {
    minHeight: "430px",

    background: "#302E36",

    borderRadius: "20px",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    textAlign: "center",

    padding: "45px 25px",

    border: "1px solid #46414F",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.20)",
  },

  emptyIllustration: {
    width: "90px",

    height: "90px",

    borderRadius: "50%",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "45px",

    background: "#3A3842",

    border: "1px solid #5B5663",

    marginBottom: "20px",
  },

  emptyTitle: {
    margin: 0,

    fontSize: "25px",

    fontWeight: "800",

    color: "#F5F3FF",
  },

  emptyText: {
    color: "#A9A6B8",

    lineHeight: "1.7",

    fontSize: "14px",

    margin: "10px 0 22px",
  },

  browseButton: {
    border: "none",

    padding: "13px 23px",

    borderRadius: "10px",

    background:
      "linear-gradient(135deg, #8B5CF6, #A855F7)",

    color: "#FFFFFF",

    fontSize: "14px",

    fontWeight: "700",

    cursor: "pointer",

    boxShadow:
      "0 8px 20px rgba(139,92,246,0.25)",
  },


  /* SECTION */

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


  /* JOB GRID */

  jobsGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(350px, 1fr))",

    gap: "22px",
  },


  /* JOB CARD */

  jobCard: {
    background: "#302E36",

    borderRadius: "18px",

    padding: "22px",

    border: "1px solid #46414F",

    boxShadow:
      "0 8px 25px rgba(0,0,0,0.18)",
  },

  jobTop: {
    display: "flex",

    alignItems: "center",

    gap: "15px",

    paddingBottom: "18px",

    borderBottom:
      "1px solid #46414F",
  },

  companyIcon: {
    width: "52px",

    height: "52px",

    borderRadius: "14px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    background: "#3A2E52",

    fontSize: "24px",

    flexShrink: 0,
  },

  jobHeading: {
    minWidth: 0,
  },

  jobTitle: {
    margin: 0,

    color: "#F5F3FF",

    fontSize: "20px",
  },

  company: {
    margin: "5px 0 0",

    color: "#A9A6B8",

    fontSize: "13px",

    fontWeight: "600",
  },


  /* DETAILS */

  detailsGrid: {
    display: "grid",

    gridTemplateColumns:
      "1fr 1fr",

    gap: "12px",

    marginTop: "18px",
  },

  detailBox: {
    display: "flex",

    alignItems: "center",

    gap: "9px",

    padding: "13px",

    borderRadius: "10px",

    background: "#3A3842",

    border: "1px solid #46414F",
  },

  detailIcon: {
    fontSize: "18px",
  },

  detailLabel: {
    display: "block",

    color: "#A9A6B8",

    fontSize: "11px",

    marginBottom: "3px",
  },

  detailValue: {
    display: "block",

    color: "#F5F3FF",

    fontSize: "13px",
  },


  /* DESCRIPTION */

  description: {
    marginTop: "17px",

    padding: "16px",

    borderRadius: "10px",

    background: "#3A3842",

    border: "1px solid #46414F",
  },

  descriptionTitle: {
    margin: "0 0 8px",

    color: "#C4B5FD",

    fontSize: "14px",
  },

  descriptionText: {
    margin: 0,

    color: "#A9A6B8",

    fontSize: "13px",

    lineHeight: "1.6",
  },


  /* ACTIONS */

  actions: {
    display: "flex",

    gap: "10px",

    marginTop: "18px",
  },

  applyButton: {
    flex: 1,

    border: "none",

    borderRadius: "9px",

    padding: "12px",

    background:
      "linear-gradient(135deg, #8B5CF6, #A855F7)",

    color: "#FFFFFF",

    fontSize: "13px",

    fontWeight: "700",

    cursor: "pointer",

    boxShadow:
      "0 5px 15px rgba(139,92,246,0.20)",
  },

  removeButton: {
    border: "1px solid #7F3A46",

    borderRadius: "9px",

    padding: "12px 17px",

    background: "#3A252C",

    color: "#FCA5A5",

    fontSize: "13px",

    fontWeight: "700",

    cursor: "pointer",
  },


  /* LOADING */

  loadingPage: {
    minHeight: "calc(100vh - 70px)",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    background: "#24232A",

    color: "#F5F3FF",
  },

  spinner: {
    fontSize: "42px",

    marginBottom: "10px",
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

export default SavedJobs;