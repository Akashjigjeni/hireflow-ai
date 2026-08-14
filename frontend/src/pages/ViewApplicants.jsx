import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import jsPDF from "jspdf";

function ViewApplicants() {
  const { jobId } = useParams();

  const [applications, setApplications] = useState([]);
  const [analysis, setAnalysis] = useState({});
  const [questions, setQuestions] = useState({});
  const [coverLetters, setCoverLetters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/applications/job/${jobId}`
      );

      setApplications(res.data);
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Failed to fetch applicants"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    const confirmAction = window.confirm(
      `Are you sure you want to ${status.toLowerCase()} this application?`
    );

    if (!confirmAction) return;

    try {
      await API.put(
        `/applications/${id}/status`,
        { status }
      );

      alert(
        `Application ${status} Successfully`
      );

      fetchApplicants();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Failed to update status"
      );
    }
  };

  const analyzeResume = async (id) => {
    try {
      const res = await API.post(
        `/ai/analyze/${id}`
      );

      setAnalysis((prev) => ({
        ...prev,
        [id]: res.data,
      }));
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Failed to analyze resume"
      );
    }
  };

  const generateQuestions = async (id) => {
    try {
      const res = await API.get(
        `/ai/interview/${id}`
      );

      setQuestions((prev) => ({
        ...prev,
        [id]: res.data.questions,
      }));
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Failed to generate interview questions"
      );
    }
  };

  const generateCoverLetter = async (id) => {
    try {
      const res = await API.get(
        `/ai/cover-letter/${id}`
      );

      setCoverLetters((prev) => ({
        ...prev,
        [id]: res.data.coverLetter,
      }));
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Failed to generate cover letter"
      );
    }
  };

  const downloadPDF = (id, name) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(
      "AI Generated Cover Letter",
      20,
      20
    );

    doc.setFontSize(12);

    const letter =
      coverLetters[id] ||
      "No Cover Letter Generated";

    const lines = doc.splitTextToSize(
      letter,
      170
    );

    doc.text(lines, 20, 35);

    doc.save(
      `${name || "Candidate"}_CoverLetter.pdf`
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div style={styles.loading}>
          <div style={styles.loadingIcon}>
            👥
          </div>

          <h2>Loading Applicants...</h2>
          <p>Please wait.</p>
        </div>
      </>
    );
  }

  return (
    <div style={styles.page}>
      <Navbar />

      <main style={styles.container}>

        {/* HEADER */}

        <section style={styles.hero}>
          <div style={styles.heroIcon}>
            👥
          </div>

          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              Job Applicants
            </h1>

            <p style={styles.heroSubtitle}>
              Review candidates and use AI-powered
              recruitment tools.
            </p>
          </div>
        </section>

        {/* COUNT */}

        <div style={styles.countBox}>
          📋{" "}
          <strong>
            {applications.length}
          </strong>{" "}
          {applications.length === 1
            ? "Applicant"
            : "Applicants"}
        </div>

        {/* EMPTY */}

        {applications.length === 0 ? (
          <div style={styles.emptyBox}>
            <div style={styles.emptyIcon}>
              📭
            </div>

            <h2>No Applicants Yet</h2>

            <p>
              Applications for this job will
              appear here.
            </p>
          </div>
        ) : (
          <div>
            {applications.map((app) => {
              const candidate =
                app.applicant || {};

              return (
                <article
                  key={app._id}
                  style={styles.card}
                >

                  {/* CANDIDATE HEADER */}

                  <div style={styles.profileSection}>
                    <img
                      src={
                        candidate.profileImage
                          ? `http://localhost:5000/${candidate.profileImage}`
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            candidate.name ||
                            "Candidate"
                          )}&background=2563eb&color=fff`
                      }
                      alt="Candidate"
                      style={styles.profileImage}
                    />

                    <div style={styles.profileInfo}>
                      <h2 style={styles.candidateName}>
                        {candidate.name ||
                          "Candidate"}
                      </h2>

                      <p style={styles.email}>
                        ✉️{" "}
                        {candidate.email ||
                          "No email"}
                      </p>

                      <div style={styles.statusRow}>
                        <span>
                          Application Status
                        </span>

                        <span
                          style={{
                            ...styles.statusBadge,
                            background:
                              app.status ===
                                "Accepted"
                                ? "#dcfce7"
                                : app.status ===
                                  "Rejected"
                                  ? "#fee2e2"
                                  : "#fef3c7",
                            color:
                              app.status ===
                                "Accepted"
                                ? "#15803d"
                                : app.status ===
                                  "Rejected"
                                  ? "#b91c1c"
                                  : "#b45309",
                          }}
                        >
                          {app.status}
                        </span>
                      </div>
                    </div>
                  </div>


                  {/* INFORMATION */}

                  <div style={styles.infoGrid}>

                    <InfoItem
                      icon="📞"
                      label="Phone"
                      value={
                        candidate.phone ||
                        "Not Added"
                      }
                    />

                    <InfoItem
                      icon="📍"
                      label="Location"
                      value={
                        candidate.location ||
                        "Not Added"
                      }
                    />

                    <InfoItem
                      icon="🎓"
                      label="Education"
                      value={
                        candidate.education ||
                        "Not Added"
                      }
                    />

                    <InfoItem
                      icon="💻"
                      label="Skills"
                      value={
                        candidate.skills ||
                        "Not Added"
                      }
                    />
                  </div>


                  {/* RESUME */}

                  <div style={styles.resumeBox}>
                    <div style={styles.resumeInfo}>
                      <strong>
                        📄 Resume
                      </strong>

                      <p>
                        Candidate's uploaded resume
                      </p>
                    </div>

                    {app.resume ? (
                      <a
                        href={`http://localhost:5000/${app.resume}`}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.resumeButton}
                      >
                        View Resume →
                      </a>
                    ) : (
                      <span style={styles.noResume}>
                        No Resume Uploaded
                      </span>
                    )}
                  </div>


                  {/* ACTIONS */}

                  <div style={styles.actions}>

                    <button
                      onClick={() =>
                        updateStatus(
                          app._id,
                          "Accepted"
                        )
                      }
                      style={styles.acceptBtn}
                    >
                      ✅ Accept
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          app._id,
                          "Rejected"
                        )
                      }
                      style={styles.rejectBtn}
                    >
                      ❌ Reject
                    </button>

                    <button
                      onClick={() =>
                        analyzeResume(app._id)
                      }
                      style={styles.analyzeBtn}
                    >
                      🤖 Analyze Resume
                    </button>

                    <button
                      onClick={() =>
                        generateQuestions(
                          app._id
                        )
                      }
                      style={styles.questionBtn}
                    >
                      🎯 Interview Questions
                    </button>

                    <button
                      onClick={() =>
                        generateCoverLetter(
                          app._id
                        )
                      }
                      style={styles.coverBtn}
                    >
                      📄 AI Cover Letter
                    </button>

                  </div>


                  {/* AI ANALYSIS */}

                  {analysis[app._id] && (
                    <div style={styles.analysisBox}>

                      <h3>
                        🤖 AI Resume Analysis
                      </h3>

                      <div style={styles.scoreBox}>
                        <span>
                          Match Score
                        </span>

                        <strong>
                          {
                            analysis[app._id]
                              .score
                          }%
                        </strong>
                      </div>

                      <p style={styles.resultText}>
                        <strong>
                          Matched Skills:
                        </strong>{" "}
                        {analysis[app._id]
                          .matchedSkills?.length
                          ? analysis[
                            app._id
                          ].matchedSkills.join(
                            ", "
                          )
                          : "None"}
                      </p>

                      <p style={styles.resultText}>
                        <strong>
                          Missing Skills:
                        </strong>{" "}
                        {analysis[app._id]
                          .missingSkills?.length
                          ? analysis[
                            app._id
                          ].missingSkills.join(
                            ", "
                          )
                          : "None"}
                      </p>

                    </div>
                  )}


                  {/* QUESTIONS */}

                  {questions[app._id] && (
                    <div style={styles.questionBox}>

                      <h3>
                        🎯 AI Interview Questions
                      </h3>

                      <ol style={styles.questionList}>
                        {questions[
                          app._id
                        ].map(
                          (question, index) => (
                            <li key={index}>
                              {question}
                            </li>
                          )
                        )}
                      </ol>

                    </div>
                  )}


                  {/* COVER LETTER */}

                  {coverLetters[app._id] && (
                    <div style={styles.coverBox}>

                      <h3>
                        📄 AI Generated Cover Letter
                      </h3>

                      <div
                        style={
                          styles.coverLetterText
                        }
                      >
                        {
                          coverLetters[
                          app._id
                          ]
                        }
                      </div>

                      <button
                        onClick={() =>
                          downloadPDF(
                            app._id,
                            candidate.name
                          )
                        }
                        style={
                          styles.downloadBtn
                        }
                      >
                        📥 Download Cover Letter PDF
                      </button>

                    </div>
                  )}

                </article>
              );
            })}
          </div>
        )}
      </main>

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

        .view-applicants-page {
          width: 100%;
          overflow-x: hidden;
        }

        @media (max-width: 900px) {
          .view-applicants-container {
            width: calc(100% - 30px) !important;
          }
        }

        @media (max-width: 600px) {

          .view-applicants-container {
            width: calc(100% - 20px) !important;
            padding-top: 20px !important;
            padding-bottom: 35px !important;
          }

          .view-applicants-hero {
            padding: 18px !important;
            gap: 12px !important;
          }

          .view-applicants-title {
            font-size: 22px !important;
          }

          .view-applicants-subtitle {
            font-size: 10px !important;
          }

          .view-applicants-card {
            padding: 16px !important;
          }

          .view-applicants-profile {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .view-applicants-profile-image {
            width: 78px !important;
            height: 78px !important;
          }

          .view-applicants-name {
            font-size: 21px !important;
          }

          .view-applicants-info-grid {
            grid-template-columns: 1fr !important;
          }

          .view-applicants-resume {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .view-applicants-resume-button {
            width: 100% !important;
            text-align: center !important;
          }

          .view-applicants-actions {
            display: grid !important;
            grid-template-columns: 1fr !important;
          }

          .view-applicants-action-button {
            width: 100% !important;
          }

          .view-applicants-score {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 5px !important;
          }

          .view-applicants-question-box,
          .view-applicants-analysis-box,
          .view-applicants-cover-box {
            padding: 15px !important;
          }

          .view-applicants-cover-text {
            font-size: 12px !important;
          }
        }

      `}</style>
    </div>
  );
}


/* =====================================================
   INFO ITEM
===================================================== */

function InfoItem({
  icon,
  label,
  value,
}) {
  return (
    <div
      className="view-applicants-info-item"
      style={styles.infoItem}
    >
      <span style={styles.infoIcon}>
        {icon}
      </span>

      <div style={styles.infoContent}>
        <small style={styles.infoLabel}>
          {label}
        </small>

        <p style={styles.infoValue}>
          {value}
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
      "min(1150px, calc(100% - 40px))",

    maxWidth: "100%",

    margin: "0 auto",

    padding: "30px 0 55px",

    minWidth: 0,
  },

  hero: {
    display: "flex",

    alignItems: "center",

    gap: "16px",

    padding: "24px",

    marginBottom: "20px",

    borderRadius: "18px",

    background:
      "linear-gradient(135deg,#1e3a8a,#2563eb,#7c3aed)",

    color: "white",

    boxShadow:
      "0 15px 35px rgba(37,99,235,.2)",

    overflow: "hidden",
  },

  heroIcon: {
    width: "55px",
    height: "55px",

    borderRadius: "14px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    background:
      "rgba(255,255,255,.15)",

    fontSize: "25px",

    flexShrink: 0,
  },

  heroContent: {
    minWidth: 0,
    flex: 1,
  },

  heroTitle: {
    margin: 0,
    fontSize: "29px",
    fontWeight: "800",
  },

  heroSubtitle: {
    margin: "5px 0 0",
    color: "rgba(255,255,255,.82)",
    fontSize: "12px",
    lineHeight: "1.5",
  },

  countBox: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",

    background: "white",

    padding: "10px 15px",

    borderRadius: "10px",

    marginBottom: "18px",

    boxShadow:
      "0 5px 15px rgba(15,23,42,.07)",

    fontSize: "13px",
  },

  card: {
    background: "white",

    padding: "24px",

    borderRadius: "18px",

    marginBottom: "20px",

    border:
      "1px solid #e2e8f0",

    boxShadow:
      "0 8px 28px rgba(15,23,42,.08)",

    minWidth: 0,

    overflow: "hidden",
  },

  profileSection: {
    display: "flex",

    alignItems: "center",

    gap: "18px",

    paddingBottom: "18px",

    borderBottom:
      "1px solid #e2e8f0",

    minWidth: 0,
  },

  profileImage: {
    width: "95px",
    height: "95px",

    borderRadius: "50%",

    objectFit: "cover",

    border:
      "4px solid #2563eb",

    flexShrink: 0,
  },

  profileInfo: {
    minWidth: 0,
    flex: 1,
  },

  candidateName: {
    margin: 0,

    fontSize: "24px",

    color: "#172554",

    fontWeight: "800",

    wordBreak: "break-word",
  },

  email: {
    margin: "6px 0 10px",

    color: "#64748b",

    fontSize: "13px",

    wordBreak: "break-word",
  },

  statusRow: {
    display: "flex",

    alignItems: "center",

    gap: "8px",

    flexWrap: "wrap",

    fontSize: "11px",

    color: "#64748b",
  },

  statusBadge: {
    padding: "5px 10px",

    borderRadius: "20px",

    fontWeight: "800",

    fontSize: "10px",
  },

  infoGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(2, minmax(0,1fr))",

    gap: "10px",

    marginTop: "18px",

    minWidth: 0,
  },

  infoItem: {
    display: "flex",

    alignItems: "center",

    gap: "10px",

    padding: "12px",

    borderRadius: "10px",

    background: "#f8fafc",

    minWidth: 0,
  },

  infoIcon: {
    width: "36px",
    height: "36px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    borderRadius: "9px",

    background: "#eff6ff",

    fontSize: "17px",

    flexShrink: 0,
  },

  infoContent: {
    minWidth: 0,
  },

  infoLabel: {
    display: "block",

    color: "#94a3b8",

    fontSize: "9px",
  },

  infoValue: {
    margin: "3px 0 0",

    color: "#334155",

    fontSize: "12px",

    fontWeight: "700",

    wordBreak: "break-word",
  },

  resumeBox: {
    marginTop: "17px",

    padding: "14px",

    borderRadius: "11px",

    background: "#f8fafc",

    display: "flex",

    alignItems: "center",

    justifyContent: "space-between",

    gap: "12px",

    flexWrap: "wrap",

    minWidth: 0,
  },

  resumeInfo: {
    minWidth: 0,
  },

  resumeButton: {
    textDecoration: "none",

    background: "#2563eb",

    color: "white",

    padding: "9px 14px",

    borderRadius: "8px",

    fontSize: "12px",

    fontWeight: "700",

    whiteSpace: "nowrap",
  },

  noResume: {
    color: "#dc2626",

    fontSize: "11px",

    fontWeight: "700",
  },

  actions: {
    display: "flex",

    flexWrap: "wrap",

    gap: "9px",

    marginTop: "18px",
  },

  acceptBtn: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "12px",
  },

  rejectBtn: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "12px",
  },

  analyzeBtn: {
    background: "#7c3aed",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "12px",
  },

  questionBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "12px",
  },

  coverBtn: {
    background: "#0ea5e9",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "12px",
  },

  analysisBox: {
    marginTop: "18px",

    padding: "18px",

    background: "#f8fafc",

    borderRadius: "11px",

    border:
      "1px solid #cbd5e1",

    minWidth: 0,

    overflow: "hidden",
  },

  scoreBox: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "10px",

    padding: "12px",

    marginBottom: "12px",

    background: "white",

    borderRadius: "9px",
  },

  resultText: {
    fontSize: "12px",

    lineHeight: "1.6",

    wordBreak: "break-word",
  },

  questionBox: {
    marginTop: "18px",

    padding: "18px",

    background: "#eef4ff",

    borderRadius: "11px",

    border:
      "1px solid #93c5fd",

    overflow: "hidden",
  },

  questionList: {
    paddingLeft: "20px",

    marginBottom: 0,

    lineHeight: "1.7",

    fontSize: "12px",

    color: "#334155",
  },

  coverBox: {
    marginTop: "18px",

    padding: "18px",

    background: "#f0fdf4",

    borderRadius: "11px",

    border:
      "1px solid #86efac",

    overflow: "hidden",
  },

  coverLetterText: {
    marginTop: "12px",

    padding: "15px",

    borderRadius: "9px",

    background: "white",

    whiteSpace: "pre-wrap",

    wordBreak: "break-word",

    overflowWrap: "anywhere",

    lineHeight: "1.7",

    fontSize: "13px",

    color: "#334155",
  },

  downloadBtn: {
    marginTop: "15px",

    background: "#16a34a",

    color: "white",

    border: "none",

    padding: "10px 15px",

    borderRadius: "8px",

    cursor: "pointer",

    fontWeight: "700",

    fontSize: "12px",
  },

  emptyBox: {
    background: "white",

    padding: "55px 20px",

    borderRadius: "18px",

    textAlign: "center",

    boxShadow:
      "0 8px 25px rgba(15,23,42,.08)",
  },

  emptyIcon: {
    fontSize: "45px",
  },

  loading: {
    minHeight: "80vh",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    color: "#172554",
  },

  loadingIcon: {
    fontSize: "42px",
  },
};

export default ViewApplicants;