import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function SavedJobs() {
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

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

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <>
        <Navbar />

        <div style={styles.loadingPage}>
          <div style={styles.spinner}>❤️</div>

          <h2>Loading Saved Jobs</h2>

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
            HEADER
        ========================= */}

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
                Keep track of opportunities you're
                interested in.
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


        {/* =========================
            EMPTY STATE
        ========================= */}

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
              Save it here and come back to it
              whenever you're ready.
            </p>

            <button
              onClick={() =>
                navigate("/jobs")
              }
              style={styles.browseButton}
            >
              🔎 Browse Available Jobs
            </button>

          </section>

        ) : (

          /* =========================
             SAVED JOBS
          ========================= */

          <section>

            <div style={styles.sectionHeader}>

              <div>
                <h2>
                  Your Saved Opportunities
                </h2>

                <p>
                  Review and apply to jobs you've
                  saved.
                </p>
              </div>

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

                        <h2>
                          {job.title}
                        </h2>

                        <p>
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
                          <small>
                            Location
                          </small>

                          <strong>
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
                          <small>
                            Salary
                          </small>

                          <strong>
                            {job.salaryRange ||
                              "Not specified"}
                          </strong>
                        </div>

                      </div>

                    </div>


                    {/* DESCRIPTION */}

                    {job.description && (
                      <div style={styles.description}>

                        <h4>
                          📝 Job Description
                        </h4>

                        <p>
                          {job.description}
                        </p>

                      </div>
                    )}


                    {/* ACTIONS */}

                    <div style={styles.actions}>

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
   STYLES
===================================================== */

const styles = {

  page: {
    minHeight: "calc(100vh - 190px)",

    background:
      "linear-gradient(135deg, #f5f7ff 0%, #eef4ff 50%, #f8f5ff 100%)",

    fontFamily:
      "'Segoe UI', Arial, sans-serif",

    color: "#172554",

    paddingBottom: "50px",
  },


  container: {
    width:
      "min(1200px, calc(100% - 50px))",

    margin: "0 auto",

    paddingTop: "35px",
  },


  /* =========================
     HERO
  ========================= */

  hero: {
    display: "flex",

    alignItems: "center",

    justifyContent: "space-between",

    gap: "20px",

    padding: "28px 32px",

    borderRadius: "22px",

    background:
      "linear-gradient(135deg, #1e3a8a, #2563eb 55%, #7c3aed)",

    color: "white",

    boxShadow:
      "0 15px 40px rgba(37, 99, 235, 0.22)",

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

    borderRadius: "18px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    background:
      "rgba(255,255,255,0.16)",

    fontSize: "30px",

    boxShadow:
      "inset 0 0 0 1px rgba(255,255,255,.15)",
  },


  heroTitle: {
    margin: 0,

    fontSize: "34px",

    fontWeight: "800",

    letterSpacing: "-0.5px",
  },


  heroSubtitle: {
    margin: "6px 0 0",

    fontSize: "14px",

    color:
      "rgba(255,255,255,.82)",
  },


  savedCount: {
    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    minWidth: "110px",

    padding: "12px 18px",

    borderRadius: "14px",

    background:
      "rgba(255,255,255,.14)",
  },


  countNumber: {
    fontSize: "27px",

    fontWeight: "800",
  },


  countText: {
    fontSize: "11px",

    color:
      "rgba(255,255,255,.82)",
  },


  /* =========================
     EMPTY STATE
  ========================= */

  emptyCard: {
    minHeight: "430px",

    background: "rgba(255,255,255,.92)",

    borderRadius: "22px",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    textAlign: "center",

    padding: "45px 25px",

    border:
      "1px solid #e2e8f0",

    boxShadow:
      "0 12px 35px rgba(15,23,42,.08)",
  },


  emptyIllustration: {
    width: "90px",

    height: "90px",

    borderRadius: "50%",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "45px",

    background:
      "linear-gradient(135deg,#eff6ff,#f5f3ff)",

    marginBottom: "20px",

    boxShadow:
      "0 10px 25px rgba(37,99,235,.10)",
  },


  emptyTitle: {
    margin: 0,

    fontSize: "25px",

    fontWeight: "800",

    color: "#172554",
  },


  emptyText: {
    color: "#64748b",

    lineHeight: "1.7",

    fontSize: "14px",

    margin:
      "10px 0 22px",
  },


  browseButton: {
    border: "none",

    padding: "13px 23px",

    borderRadius: "10px",

    background:
      "linear-gradient(135deg,#2563eb,#7c3aed)",

    color: "white",

    fontSize: "14px",

    fontWeight: "700",

    cursor: "pointer",

    boxShadow:
      "0 8px 20px rgba(37,99,235,.22)",
  },


  /* =========================
     SECTION
  ========================= */

  sectionHeader: {
    marginBottom: "18px",
  },


  /* =========================
     JOB GRID
  ========================= */

  jobsGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(350px, 1fr))",

    gap: "22px",
  },


  /* =========================
     JOB CARD
  ========================= */

  jobCard: {
    background: "white",

    borderRadius: "18px",

    padding: "22px",

    border:
      "1px solid #e2e8f0",

    boxShadow:
      "0 8px 28px rgba(15,23,42,.07)",

    transition:
      "transform .2s ease, box-shadow .2s ease",
  },


  jobTop: {
    display: "flex",

    alignItems: "center",

    gap: "15px",

    paddingBottom: "18px",

    borderBottom:
      "1px solid #e2e8f0",
  },


  companyIcon: {
    width: "52px",

    height: "52px",

    borderRadius: "14px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    background: "#eff6ff",

    fontSize: "24px",

    flexShrink: 0,
  },


  jobHeading: {
    minWidth: 0,
  },


  jobHeadingH2: {
    margin: 0,
  },


  company: {
    margin: "5px 0 0",

    color: "#64748b",

    fontSize: "13px",

    fontWeight: "600",
  },


  /* =========================
     DETAILS
  ========================= */

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

    padding: "12px",

    borderRadius: "10px",

    background: "#f8fafc",
  },


  detailIcon: {
    fontSize: "18px",
  },


  detailBoxSmall: {
    display: "block",
  },


  detailBoxStrong: {
    display: "block",
  },


  /* =========================
     DESCRIPTION
  ========================= */

  description: {
    marginTop: "17px",

    padding: "14px",

    borderRadius: "10px",

    background: "#f8fafc",
  },


  /* =========================
     ACTIONS
  ========================= */

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
      "linear-gradient(135deg,#2563eb,#7c3aed)",

    color: "white",

    fontSize: "13px",

    fontWeight: "700",

    cursor: "pointer",
  },


  removeButton: {
    border: "1px solid #fecaca",

    borderRadius: "9px",

    padding: "12px 17px",

    background: "#fff1f2",

    color: "#dc2626",

    fontSize: "13px",

    fontWeight: "700",

    cursor: "pointer",
  },


  /* =========================
     LOADING
  ========================= */

  loadingPage: {
    minHeight: "calc(100vh - 190px)",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    background:
      "linear-gradient(135deg,#f5f7ff,#eef4ff)",

    color: "#172554",
  },


  spinner: {
    fontSize: "42px",

    marginBottom: "10px",
  },
};

export default SavedJobs;