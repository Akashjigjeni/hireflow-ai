import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

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

      {/* Background */}
      <div style={styles.background}></div>

      {/* Blur Overlay */}
      <div style={styles.overlay}></div>

      {/* Main Card */}
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.icon}>
            💼
          </div>

          <h1 style={styles.title}>
            Apply for Job
          </h1>

          <p style={styles.subtitle}>
            Take the next step toward your career
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
              Tell the employer why you are a good
              fit for this position.
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

              <div>
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
  );
};


/* =====================================================
   STYLES
===================================================== */

const styles = {

  page: {
    width: "100%",
    height: "100vh",
    minHeight: "100vh",

    position: "relative",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    overflow: "hidden",

    fontFamily:
      "'Segoe UI', Arial, sans-serif",
  },


  background: {
    position: "absolute",
    inset: 0,

    backgroundImage:
      "url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2000&q=85')",

    backgroundSize: "cover",
    backgroundPosition: "center",

    filter: "blur(6px)",

    transform: "scale(1.06)",

    zIndex: 0,
  },


  overlay: {
    position: "absolute",
    inset: 0,

    background:
      "linear-gradient(135deg, rgba(15,23,42,0.86), rgba(30,64,175,0.68), rgba(76,29,149,0.65))",

    backdropFilter: "blur(3px)",

    zIndex: 1,
  },


  card: {
    width: "min(650px, calc(100% - 40px))",

    maxHeight: "calc(100vh - 50px)",

    overflowY: "auto",

    boxSizing: "border-box",

    padding: "35px 42px",

    borderRadius: "22px",

    background:
      "rgba(255,255,255,0.96)",

    boxShadow:
      "0 25px 70px rgba(0,0,0,0.4)",

    position: "relative",

    zIndex: 2,
  },


  header: {
    textAlign: "center",

    marginBottom: "25px",
  },


  icon: {
    width: "58px",
    height: "58px",

    margin: "0 auto 12px",

    borderRadius: "16px",

    background:
      "linear-gradient(135deg,#2563eb,#7c3aed)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "27px",

    boxShadow:
      "0 10px 25px rgba(37,99,235,0.25)",
  },


  title: {
    margin: 0,

    fontSize: "30px",

    fontWeight: "800",

    color: "#172554",
  },


  subtitle: {
    margin:
      "7px 0 0",

    color: "#64748b",

    fontSize: "14px",
  },


  form: {
    width: "100%",
  },


  field: {
    marginBottom: "20px",
  },


  label: {
    display: "block",

    marginBottom: "8px",

    color: "#1e293b",

    fontSize: "14px",

    fontWeight: "700",
  },


  textarea: {
    width: "100%",

    boxSizing: "border-box",

    resize: "vertical",

    minHeight: "150px",

    padding: "14px",

    borderRadius: "11px",

    border:
      "1px solid #d7deeb",

    outline: "none",

    background: "#f8fafc",

    color: "#1e293b",

    fontSize: "14px",

    lineHeight: "1.6",

    fontFamily:
      "'Segoe UI', Arial, sans-serif",
  },


  helper: {
    marginTop: "6px",

    color: "#64748b",

    fontSize: "11px",
  },


  uploadBox: {
    minHeight: "85px",

    padding: "15px",

    boxSizing: "border-box",

    borderRadius: "12px",

    border:
      "2px dashed #93c5fd",

    background:
      "linear-gradient(135deg,#eff6ff,#f5f3ff)",

    display: "flex",

    alignItems: "center",

    gap: "14px",

    cursor: "pointer",

    transition:
      "0.2s ease",
  },


  uploadIcon: {
    width: "48px",
    height: "48px",

    borderRadius: "12px",

    background: "#dbeafe",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "22px",

    flexShrink: 0,
  },


  uploadTitle: {
    display: "block",

    color: "#1e3a8a",

    fontSize: "13px",

    maxWidth: "430px",

    overflow: "hidden",

    textOverflow: "ellipsis",

    whiteSpace: "nowrap",
  },


  uploadText: {
    margin: "4px 0 0",

    color: "#64748b",

    fontSize: "11px",
  },


  buttonRow: {
    display: "flex",

    gap: "12px",

    marginTop: "8px",
  },


  cancelButton: {
    flex: "0 0 110px",

    height: "46px",

    border: "1px solid #cbd5e1",

    borderRadius: "9px",

    background: "#f8fafc",

    color: "#475569",

    fontSize: "13px",

    fontWeight: "700",

    cursor: "pointer",
  },


  applyButton: {
    flex: 1,

    height: "46px",

    border: "none",

    borderRadius: "9px",

    background:
      "linear-gradient(135deg,#2563eb,#7c3aed)",

    color: "white",

    fontSize: "14px",

    fontWeight: "700",

    cursor: "pointer",

    boxShadow:
      "0 8px 20px rgba(37,99,235,0.25)",
  },


  security: {
    textAlign: "center",

    marginTop: "18px",

    color: "#64748b",

    fontSize: "10px",
  },
};


export default Apply;