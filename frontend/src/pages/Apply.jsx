import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const Apply = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitApplication = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("coverLetter", coverLetter);

      if (resume) {
        formData.append("resume", resume);
      }

      await API.post(`/applications/${jobId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Application Submitted Successfully! 🎉");

      navigate("/dashboard");
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Application Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.card}>

          {/* Header */}
          <div style={styles.header}>
            <div style={styles.icon}>
              💼
            </div>

            <p style={styles.smallTitle}>
              JOB APPLICATION
            </p>

            <h1 style={styles.title}>
              Apply for Job
            </h1>

            <p style={styles.subtitle}>
              Take the next step toward your career.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={submitApplication}
            style={styles.form}
          >

            {/* Cover Letter */}
            <div style={styles.field}>
              <label style={styles.label}>
                ✍️ Cover Letter
              </label>

              <textarea
                value={coverLetter}
                onChange={(e) =>
                  setCoverLetter(e.target.value)
                }
                placeholder="Write your cover letter here..."
                required
                rows="8"
                style={styles.textarea}
              />

              <div style={styles.helper}>
                Tell the employer why you are a good fit
                for this position.
              </div>
            </div>

            {/* Resume */}
            <div style={styles.field}>
              <label style={styles.label}>
                📄 Upload Resume
              </label>

              <label style={styles.uploadBox}>
                <div style={styles.uploadIcon}>
                  📎
                </div>

                <div style={styles.uploadContent}>
                  <strong style={styles.uploadTitle}>
                    {resume
                      ? resume.name
                      : "Choose your resume"}
                  </strong>

                  <p style={styles.uploadText}>
                    {resume
                      ? `${(
                          resume.size / 1024
                        ).toFixed(1)} KB`
                      : "PDF files only"}
                  </p>
                </div>

                <div style={styles.chooseBadge}>
                  Browse
                </div>

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => {
                    const file =
                      e.target.files[0];

                    if (
                      file &&
                      file.type !==
                        "application/pdf"
                    ) {
                      alert(
                        "Please select a PDF file only."
                      );

                      e.target.value = "";
                      return;
                    }

                    setResume(file);
                  }}
                  required
                  style={{
                    display: "none",
                  }}
                />
              </label>

              <div style={styles.helper}>
                Maximum recommended size: 5 MB
              </div>
            </div>

            {/* Buttons */}
            <div style={styles.buttonRow}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={styles.cancelButton}
                disabled={loading}
              >
                ← Back
              </button>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.applyButton,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {loading
                  ? "⏳ Submitting..."
                  : "🚀 Submit Application"}
              </button>
            </div>
          </form>

          {/* Security */}
          <div style={styles.security}>
            🔒 Your application information is secure
          </div>

        </div>
      </div>
    </div>
  );
};


/* =====================================================
   DARK CHARCOAL + PURPLE THEME
===================================================== */

const styles = {

  page: {
    minHeight: "100vh",
    background: "#24232A",
    color: "#F5F3FF",
    fontFamily:
      "system-ui, 'Segoe UI', Roboto, Arial, sans-serif",
  },

  container: {
    width: "min(720px, calc(100% - 40px))",
    margin: "0 auto",
    padding: "45px 0 60px",
  },

  card: {
    width: "100%",
    padding: "38px",
    borderRadius: "22px",
    background: "#302E36",
    border: "1px solid #46414F",
    boxShadow:
      "0 15px 45px rgba(0,0,0,0.25)",
  },

  /* HEADER */

  header: {
    textAlign: "center",
    marginBottom: "30px",
  },

  icon: {
    width: "65px",
    height: "65px",
    margin: "0 auto 15px",
    borderRadius: "18px",

    background:
      "linear-gradient(135deg, #8B5CF6, #A855F7)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "30px",

    boxShadow:
      "0 8px 22px rgba(139,92,246,0.25)",
  },

  smallTitle: {
    margin: "0 0 5px",
    color: "#A78BFA",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "800",
    color: "#F5F3FF",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#A9A6B8",
    fontSize: "14px",
  },


  /* FORM */

  form: {
    width: "100%",
  },

  field: {
    marginBottom: "23px",
  },

  label: {
    display: "block",
    marginBottom: "9px",
    color: "#C4B5FD",
    fontSize: "14px",
    fontWeight: "700",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: "160px",

    padding: "15px",

    borderRadius: "12px",

    border:
      "1px solid #46414F",

    outline: "none",

    background: "#3A3842",

    color: "#F5F3FF",

    fontSize: "14px",

    lineHeight: "1.6",

    fontFamily:
      "system-ui, 'Segoe UI', Roboto, Arial, sans-serif",
  },

  helper: {
    marginTop: "7px",
    color: "#777383",
    fontSize: "11px",
  },


  /* UPLOAD */

  uploadBox: {
    minHeight: "90px",

    padding: "16px",

    boxSizing: "border-box",

    borderRadius: "13px",

    border:
      "2px dashed #6D4BC4",

    background: "#3A3842",

    display: "flex",

    alignItems: "center",

    gap: "14px",

    cursor: "pointer",

    transition: "0.2s ease",
  },

  uploadIcon: {
    width: "50px",
    height: "50px",

    borderRadius: "13px",

    background: "#3A2E52",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "23px",

    flexShrink: 0,
  },

  uploadContent: {
    flex: 1,
    minWidth: 0,
  },

  uploadTitle: {
    display: "block",

    color: "#F5F3FF",

    fontSize: "13px",

    overflow: "hidden",

    textOverflow: "ellipsis",

    whiteSpace: "nowrap",
  },

  uploadText: {
    margin: "5px 0 0",

    color: "#A9A6B8",

    fontSize: "11px",
  },

  chooseBadge: {
    padding: "8px 13px",

    borderRadius: "8px",

    background: "#3A2E52",

    border: "1px solid #6D4BC4",

    color: "#C4B5FD",

    fontSize: "11px",

    fontWeight: "700",
  },


  /* BUTTONS */

  buttonRow: {
    display: "flex",

    gap: "12px",

    marginTop: "10px",
  },

  cancelButton: {
    flex: "0 0 115px",

    height: "48px",

    border: "1px solid #46414F",

    borderRadius: "10px",

    background: "#3A3842",

    color: "#A9A6B8",

    fontSize: "13px",

    fontWeight: "700",

    cursor: "pointer",
  },

  applyButton: {
    flex: 1,

    height: "48px",

    border: "none",

    borderRadius: "10px",

    background:
      "linear-gradient(135deg, #8B5CF6, #A855F7)",

    color: "#FFFFFF",

    fontSize: "14px",

    fontWeight: "700",

    boxShadow:
      "0 8px 20px rgba(139,92,246,0.25)",
  },


  /* SECURITY */

  security: {
    textAlign: "center",

    marginTop: "22px",

    paddingTop: "18px",

    borderTop:
      "1px solid #46414F",

    color: "#777383",

    fontSize: "11px",
  },
};

export default Apply;