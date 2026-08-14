import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    salaryRange: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // Always start this page from the top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/jobs/${id}`);

      setJob({
        title: res.data.title || "",
        company: res.data.company || "",
        location: res.data.location || "",
        salaryRange: res.data.salaryRange || "",
        description: res.data.description || "",
      });
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Failed to load job"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  const updateJob = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);

      await API.put(`/jobs/${id}`, job);

      alert("Job Updated Successfully! ✅");

      navigate("/employer-dashboard");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Failed to update job"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div style={styles.loadingPage}>
          <div style={styles.loadingIcon}>
            ⏳
          </div>

          <h2>Loading Job...</h2>

          <p>Please wait while we load the job details.</p>
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

          <div style={styles.heroIcon}>
            ✏️
          </div>

          <div style={styles.heroContent}>
            <div style={styles.badge}>
              JOB MANAGEMENT
            </div>

            <h1 style={styles.heroTitle}>
              Edit Job
            </h1>

            <p style={styles.heroSubtitle}>
              Update your job posting information
              below.
            </p>
          </div>

        </section>


        {/* =========================
            FORM CARD
        ========================= */}

        <section style={styles.card}>

          <div style={styles.cardHeader}>

            <div>
              <h2 style={styles.cardTitle}>
                Job Information
              </h2>

              <p style={styles.cardSubtitle}>
                Make changes to your job posting
                and save them.
              </p>
            </div>

            <div style={styles.editBadge}>
              ✏️ Editing
            </div>

          </div>


          <form onSubmit={updateJob}>

            <div style={styles.grid}>

              {/* JOB TITLE */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Job Title
                </label>

                <div style={styles.inputWrapper}>
                  <span style={styles.icon}>
                    💼
                  </span>

                  <input
                    type="text"
                    name="title"
                    value={job.title}
                    onChange={handleChange}
                    placeholder="e.g. React Developer"
                    required
                    style={styles.input}
                  />
                </div>
              </div>


              {/* COMPANY */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Company
                </label>

                <div style={styles.inputWrapper}>
                  <span style={styles.icon}>
                    🏢
                  </span>

                  <input
                    type="text"
                    name="company"
                    value={job.company}
                    onChange={handleChange}
                    placeholder="Company name"
                    required
                    style={styles.input}
                  />
                </div>
              </div>


              {/* LOCATION */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Location
                </label>

                <div style={styles.inputWrapper}>
                  <span style={styles.icon}>
                    📍
                  </span>

                  <input
                    type="text"
                    name="location"
                    value={job.location}
                    onChange={handleChange}
                    placeholder="e.g. Pune"
                    required
                    style={styles.input}
                  />
                </div>
              </div>


              {/* SALARY */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Salary Range
                </label>

                <div style={styles.inputWrapper}>
                  <span style={styles.icon}>
                    💰
                  </span>

                  <input
                    type="text"
                    name="salaryRange"
                    value={job.salaryRange}
                    onChange={handleChange}
                    placeholder="e.g. ₹5 - ₹8 LPA"
                    required
                    style={styles.input}
                  />
                </div>
              </div>


              {/* DESCRIPTION */}

              <div style={styles.fullField}>
                <label style={styles.label}>
                  Job Description
                </label>

                <div style={styles.textareaWrapper}>

                  <textarea
                    rows="7"
                    name="description"
                    value={job.description}
                    onChange={handleChange}
                    placeholder="Write a clear description of the role, responsibilities and requirements..."
                    required
                    style={styles.textarea}
                  />

                </div>
              </div>

            </div>


            {/* =========================
                ACTIONS
            ========================= */}

            <div style={styles.actions}>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/employer-dashboard"
                  )
                }
                disabled={updating}
                style={styles.cancelButton}
              >
                ← Cancel
              </button>

              <button
                type="submit"
                disabled={updating}
                style={{
                  ...styles.updateButton,
                  opacity: updating ? 0.7 : 1,
                }}
              >
                {updating
                  ? "⏳ Updating..."
                  : "💾 Update Job"}
              </button>

            </div>

          </form>

        </section>


        {/* =========================
            TIP
        ========================= */}

        <div style={styles.tip}>

          <div style={styles.tipIcon}>
            💡
          </div>

          <div>
            <strong>
              Tip
            </strong>

            <p>
              Keep the job title, salary,
              location and description clear
              to attract better candidates.
            </p>
          </div>

        </div>

      </main>


      {/* =========================
          RESPONSIVE CSS
      ========================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          margin: 0;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }

        @media (max-width: 700px) {

          .edit-job-container {
            width:
              calc(100% - 24px) !important;

            padding-top: 20px !important;
            padding-bottom: 30px !important;
          }

          .edit-job-hero {
            padding: 20px !important;
            gap: 12px !important;
          }

          .edit-job-hero-title {
            font-size: 24px !important;
          }

          .edit-job-card {
            padding: 20px !important;
          }

          .edit-job-grid {
            grid-template-columns: 1fr !important;
          }

          .edit-job-actions {
            flex-direction: column-reverse !important;
          }

          .edit-job-actions button {
            width: 100% !important;
          }

          .edit-job-tip {
            align-items: flex-start !important;
          }

        }

      `}</style>

    </div>
  );
}


/* =====================================================
   STYLES
===================================================== */

const styles = {

  page: {
    width: "100%",
    minHeight: "100vh",

    background:
      "linear-gradient(135deg,#eef4ff,#f8fafc,#f5f3ff)",

    color: "#172554",

    fontFamily:
      "'Segoe UI', Arial, sans-serif",
  },


  container: {
    width:
      "min(950px, calc(100% - 40px))",

    maxWidth: "100%",

    margin: "0 auto",

    padding: "30px 0 50px",

    minWidth: 0,

  },


  /* HERO */

  hero: {
    display: "flex",

    alignItems: "center",

    gap: "18px",

    padding: "25px",

    marginBottom: "22px",

    borderRadius: "18px",

    background:
      "linear-gradient(135deg,#1e3a8a,#2563eb,#7c3aed)",

    color: "white",

    boxShadow:
      "0 15px 35px rgba(37,99,235,.2)",

    minWidth: 0,

    overflow: "hidden",
  },


  heroIcon: {
    width: "58px",

    height: "58px",

    borderRadius: "15px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    background:
      "rgba(255,255,255,.15)",

    fontSize: "26px",

    flexShrink: 0,
  },


  heroContent: {
    minWidth: 0,

    flex: 1,
  },


  badge: {
    display: "inline-block",

    padding: "5px 9px",

    borderRadius: "20px",

    background:
      "rgba(255,255,255,.13)",

    border:
      "1px solid rgba(255,255,255,.2)",

    fontSize: "9px",

    fontWeight: "700",

    letterSpacing: "1px",

    marginBottom: "7px",
  },


  heroTitle: {
    margin: 0,

    fontSize: "29px",

    fontWeight: "800",
  },


  heroSubtitle: {
    margin: "5px 0 0",

    color:
      "rgba(255,255,255,.8)",

    fontSize: "13px",

    lineHeight: "1.5",
  },


  /* CARD */

  card: {
    background: "white",

    padding: "30px",

    borderRadius: "18px",

    border:
      "1px solid #e2e8f0",

    boxShadow:
      "0 10px 30px rgba(15,23,42,.08)",

    minWidth: 0,
  },


  cardHeader: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "flex-start",

    gap: "15px",

    paddingBottom: "20px",

    marginBottom: "24px",

    borderBottom:
      "1px solid #e2e8f0",
  },


  cardTitle: {
    margin: 0,

    fontSize: "21px",

    fontWeight: "800",

    color: "#172554",
  },


  cardSubtitle: {
    margin: "5px 0 0",

    color: "#64748b",

    fontSize: "12px",
  },


  editBadge: {
    padding: "7px 11px",

    borderRadius: "20px",

    background: "#eff6ff",

    color: "#2563eb",

    fontSize: "10px",

    fontWeight: "700",

    whiteSpace: "nowrap",
  },


  /* FORM */

  grid: {
    display: "grid",

    gridTemplateColumns:
      "1fr 1fr",

    gap: "20px",

    minWidth: 0,
  },


  field: {
    minWidth: 0,
  },


  fullField: {
    gridColumn: "1 / -1",

    minWidth: 0,
  },


  label: {
    display: "block",

    marginBottom: "7px",

    color: "#334155",

    fontSize: "12px",

    fontWeight: "700",
  },


  inputWrapper: {
    height: "47px",

    display: "flex",

    alignItems: "center",

    gap: "9px",

    padding: "0 12px",

    border:
      "1px solid #dbe3ef",

    borderRadius: "10px",

    background: "#f8fafc",

    overflow: "hidden",

    transition: ".2s",
  },


  icon: {
    flexShrink: 0,

    fontSize: "15px",
  },


  input: {
    width: "100%",

    minWidth: 0,

    height: "100%",

    border: "none",

    outline: "none",

    background: "transparent",

    color: "#172554",

    fontSize: "13px",
  },


  textareaWrapper: {
    padding: "10px 12px",

    border:
      "1px solid #dbe3ef",

    borderRadius: "10px",

    background: "#f8fafc",

  },


  textarea: {
    width: "100%",

    border: "none",

    outline: "none",

    resize: "vertical",

    minHeight: "150px",

    background: "transparent",

    color: "#172554",

    fontFamily:
      "'Segoe UI', Arial, sans-serif",

    fontSize: "13px",

    lineHeight: "1.6",
  },


  /* ACTIONS */

  actions: {
    display: "flex",

    justifyContent: "flex-end",

    gap: "12px",

    marginTop: "28px",

    paddingTop: "22px",

    borderTop:
      "1px solid #e2e8f0",
  },


  cancelButton: {
    minWidth: "120px",

    height: "45px",

    border:
      "1px solid #cbd5e1",

    borderRadius: "9px",

    background: "white",

    color: "#475569",

    fontWeight: "700",

    cursor: "pointer",
  },


  updateButton: {
    minWidth: "160px",

    height: "45px",

    border: "none",

    borderRadius: "9px",

    background:
      "linear-gradient(135deg,#2563eb,#7c3aed)",

    color: "white",

    fontWeight: "700",

    cursor: "pointer",

    boxShadow:
      "0 8px 18px rgba(37,99,235,.2)",
  },


  /* TIP */

  tip: {
    display: "flex",

    alignItems: "center",

    gap: "13px",

    marginTop: "18px",

    padding: "15px 18px",

    borderRadius: "12px",

    background:
      "linear-gradient(135deg,#eef4ff,#f5f3ff)",

    border:
      "1px solid #dbeafe",
  },


  tipIcon: {
    width: "38px",

    height: "38px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    borderRadius: "9px",

    background: "white",

    fontSize: "18px",

    flexShrink: 0,
  },


  /* LOADING */

  loadingPage: {
    minHeight:
      "calc(100vh - 80px)",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "flex-start",

    paddingTop: "80px",

    color: "#172554",

    background:
      "linear-gradient(135deg,#eef4ff,#f8fafc,#f5f3ff)",
  },


  loadingIcon: {
    fontSize: "40px",

    marginBottom: "8px",
  },
};

export default EditJob;