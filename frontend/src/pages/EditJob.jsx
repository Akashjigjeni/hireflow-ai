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

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    fetchJob();
  }, [id]);

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
          <div style={styles.loadingCard}>
            <div style={styles.loadingIcon}>⏳</div>

            <h2 style={styles.loadingTitle}>
              Loading Job...
            </h2>

            <p style={styles.loadingText}>
              Please wait while we load the job details.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div style={styles.page}>
      <Navbar />

      <main style={styles.container}>

        {/* HERO */}
        <section style={styles.hero}>

          <div style={styles.heroIcon}>
            ✏️
          </div>

          <div style={styles.heroContent}>

            <div style={styles.badge}>
              EMPLOYER RECRUITMENT
            </div>

            <h1 style={styles.heroTitle}>
              Edit Job
            </h1>

            <p style={styles.heroSubtitle}>
              Update your job posting and keep your
              opportunity information accurate.
            </p>

          </div>

        </section>


        {/* FORM CARD */}
        <section style={styles.card}>

          <div style={styles.cardHeader}>

            <div>
              <h2 style={styles.cardTitle}>
                📄 Job Information
              </h2>

              <p style={styles.cardSubtitle}>
                Update the details of your job posting.
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
                  💼 Job Title
                </label>

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


              {/* COMPANY */}
              <div style={styles.field}>

                <label style={styles.label}>
                  🏢 Company
                </label>

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


              {/* LOCATION */}
              <div style={styles.field}>

                <label style={styles.label}>
                  📍 Location
                </label>

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


              {/* SALARY */}
              <div style={styles.field}>

                <label style={styles.label}>
                  💰 Salary Range
                </label>

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


              {/* DESCRIPTION */}
              <div style={styles.fullField}>

                <label style={styles.label}>
                  📝 Job Description
                </label>

                <textarea
                  rows="8"
                  name="description"
                  value={job.description}
                  onChange={handleChange}
                  placeholder="Write a clear description of the role, responsibilities and requirements..."
                  required
                  style={styles.textarea}
                />

              </div>

            </div>


            {/* ACTIONS */}
            <div style={styles.actions}>

              <button
                type="button"
                onClick={() =>
                  navigate("/employer-dashboard")
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
                  cursor: updating
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {updating
                  ? "⏳ Updating..."
                  : "💾 Update Job"}
              </button>

            </div>

          </form>

        </section>


        {/* TIP */}
        <div style={styles.tip}>

          <div style={styles.tipIcon}>
            💡
          </div>

          <div>
            <strong style={styles.tipTitle}>
              Quick Tip
            </strong>

            <p style={styles.tipText}>
              Keep the job title, salary, location and
              description clear to attract better
              candidates.
            </p>
          </div>

        </div>

      </main>


      <style>{`

        * {
          box-sizing: border-box;
        }

        @media (max-width: 700px) {

          .edit-job-container {
            width: calc(100% - 24px) !important;
            padding-top: 20px !important;
            padding-bottom: 35px !important;
          }

          .edit-job-hero {
            padding: 20px !important;
          }

          .edit-job-title {
            font-size: 28px !important;
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

          .edit-job-card-header {
            flex-direction: column !important;
          }

        }

      `}</style>

    </div>
  );
}


/* =========================================
   STYLES
========================================= */

const styles = {

  page: {
    minHeight: "100vh",
    width: "100%",
    background:
      "linear-gradient(135deg, #24232a 0%, #1f1e25 50%, #292535 100%)",
    color: "#f5f3ff",
    fontFamily:
      "system-ui, 'Segoe UI', Roboto, Arial, sans-serif",
  },


  container: {
    width: "min(1180px, calc(100% - 40px))",
    margin: "0 auto",
    padding: "38px 0 60px",
  },


  /* HERO */

  hero: {
    display: "flex",
    alignItems: "center",
    gap: "22px",
    padding: "30px 34px",
    marginBottom: "28px",
    borderRadius: "22px",

    background:
      "linear-gradient(135deg, #263a73 0%, #315bc4 55%, #7c3aed 100%)",

    border:
      "1px solid rgba(167,139,250,0.35)",

    boxShadow:
      "0 18px 45px rgba(0,0,0,0.35)",

    overflow: "hidden",
  },


  heroIcon: {
    width: "78px",
    height: "78px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: "20px",

    background:
      "rgba(255,255,255,0.12)",

    border:
      "1px solid rgba(255,255,255,0.15)",

    fontSize: "34px",
    flexShrink: 0,
  },


  heroContent: {
    minWidth: 0,
  },


  badge: {
    display: "inline-block",

    padding: "7px 13px",
    marginBottom: "10px",

    borderRadius: "30px",

    background:
      "rgba(255,255,255,0.10)",

    border:
      "1px solid rgba(255,255,255,0.20)",

    color: "#e9ddff",

    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.2px",
  },


  heroTitle: {
    margin: 0,

    color: "#ffffff",

    fontSize: "38px",
    fontWeight: "800",
    letterSpacing: "-0.5px",
  },


  heroSubtitle: {
    margin: "8px 0 0",

    color: "#d7d3e6",

    fontSize: "15px",
  },


  /* MAIN CARD */

  card: {
    padding: "34px",

    borderRadius: "22px",

    background:
      "linear-gradient(145deg, #302e36, #29272f)",

    border:
      "1px solid #46414f",

    boxShadow:
      "0 18px 45px rgba(0,0,0,0.30)",
  },


  cardHeader: {
    display: "flex",

    alignItems: "flex-start",
    justifyContent: "space-between",

    gap: "20px",

    paddingBottom: "24px",
    marginBottom: "28px",

    borderBottom:
      "1px solid #46414f",
  },


  cardTitle: {
    margin: 0,

    color: "#f5f3ff",

    fontSize: "25px",
    fontWeight: "800",
  },


  cardSubtitle: {
    margin: "7px 0 0",

    color: "#a9a6b8",

    fontSize: "14px",
  },


  editBadge: {
    padding: "9px 15px",

    borderRadius: "25px",

    background:
      "rgba(139,92,246,0.14)",

    border:
      "1px solid rgba(139,92,246,0.35)",

    color: "#c4b5fd",

    fontSize: "12px",
    fontWeight: "700",

    whiteSpace: "nowrap",
  },


  /* FORM */

  grid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",

    gap: "22px",
  },


  field: {
    minWidth: 0,
  },


  fullField: {
    gridColumn: "1 / -1",
  },


  label: {
    display: "block",

    marginBottom: "9px",

    color: "#d8d5e2",

    fontSize: "13px",
    fontWeight: "700",
  },


  input: {
    width: "100%",
    height: "54px",

    padding: "0 16px",

    borderRadius: "12px",

    border:
      "1px solid #46414f",

    outline: "none",

    background:
      "#24232a",

    color: "#f5f3ff",

    fontSize: "14px",

    transition:
      "border 0.2s ease, box-shadow 0.2s ease",
  },


  textarea: {
    width: "100%",
    minHeight: "180px",

    padding: "15px 16px",

    borderRadius: "12px",

    border:
      "1px solid #46414f",

    outline: "none",

    resize: "vertical",

    background:
      "#24232a",

    color: "#f5f3ff",

    fontSize: "14px",
    lineHeight: "1.6",

    fontFamily:
      "inherit",
  },


  /* ACTIONS */

  actions: {
    display: "flex",

    justifyContent: "flex-end",

    gap: "14px",

    marginTop: "30px",
    paddingTop: "25px",

    borderTop:
      "1px solid #46414f",
  },


  cancelButton: {
    minWidth: "130px",
    height: "48px",

    border:
      "1px solid #55505f",

    borderRadius: "10px",

    background:
      "#302e36",

    color: "#c8c4d4",

    fontSize: "14px",
    fontWeight: "700",

    cursor: "pointer",
  },


  updateButton: {
    minWidth: "175px",
    height: "48px",

    border: "none",

    borderRadius: "10px",

    background:
      "linear-gradient(135deg, #7c3aed, #a855f7)",

    color: "#ffffff",

    fontSize: "14px",
    fontWeight: "800",

    boxShadow:
      "0 10px 25px rgba(139,92,246,0.28)",
  },


  /* TIP */

  tip: {
    display: "flex",

    alignItems: "center",

    gap: "15px",

    marginTop: "22px",
    padding: "18px 20px",

    borderRadius: "16px",

    background:
      "rgba(139,92,246,0.08)",

    border:
      "1px solid rgba(139,92,246,0.22)",
  },


  tipIcon: {
    width: "48px",
    height: "48px",

    display: "flex",

    alignItems: "center",
    justifyContent: "center",

    flexShrink: 0,

    borderRadius: "13px",

    background:
      "rgba(139,92,246,0.18)",

    fontSize: "22px",
  },


  tipTitle: {
    color: "#e9ddff",

    fontSize: "14px",
  },


  tipText: {
    margin: "4px 0 0",

    color: "#a9a6b8",

    fontSize: "13px",
    lineHeight: "1.6",
  },


  /* LOADING */

  loadingPage: {
    minHeight: "calc(100vh - 80px)",

    display: "flex",

    alignItems: "center",
    justifyContent: "center",

    padding: "30px",

    background:
      "linear-gradient(135deg, #24232a, #1f1e25)",
  },


  loadingCard: {
    textAlign: "center",

    padding: "45px 55px",

    borderRadius: "22px",

    background:
      "#302e36",

    border:
      "1px solid #46414f",

    boxShadow:
      "0 20px 50px rgba(0,0,0,0.35)",
  },


  loadingIcon: {
    fontSize: "42px",

    marginBottom: "10px",
  },


  loadingTitle: {
    margin: "0 0 8px",

    color: "#f5f3ff",
  },


  loadingText: {
    margin: 0,

    color: "#a9a6b8",
  },

};

export default EditJob;