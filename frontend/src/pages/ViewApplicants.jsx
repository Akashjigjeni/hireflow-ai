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

  const fetchApplicants = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/applications/job/${jobId}`
      );

      setApplications(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const updateStatus = async (id, status) => {
    try {
      await API.put(
        `/applications/${id}/status`,
        {
          status,
        }
      );

      alert(`Application ${status} Successfully`);

      fetchApplicants();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const analyzeResume = async (applicationId) => {
    try {
      const res = await API.post(
        `/ai/analyze/${applicationId}`
      );

      setAnalysis((prev) => ({
        ...prev,
        [applicationId]: res.data,
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to analyze resume");
    }
  };

  const generateQuestions = async (
    applicationId
  ) => {
    try {
      const res = await API.get(
        `/ai/interview/${applicationId}`
      );

      setQuestions((prev) => ({
        ...prev,
        [applicationId]: res.data.questions,
      }));
    } catch (err) {
      console.error(err);

      alert(
        "Failed to generate interview questions"
      );
    }
  };

  const generateCoverLetter = async (
    applicationId
  ) => {
    try {
      const res = await API.get(
        `/ai/cover-letter/${applicationId}`
      );

      setCoverLetters((prev) => ({
        ...prev,
        [applicationId]: res.data.coverLetter,
      }));
    } catch (err) {
      console.error(err);

      alert(
        "Failed to generate cover letter"
      );
    }
  };

  const downloadPDF = (
    applicationId,
    applicantName
  ) => {
    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text(
      "AI Generated Cover Letter",
      20,
      20
    );

    doc.setFontSize(12);

    const letter =
      coverLetters[applicationId] ||
      "No Cover Letter Generated";

    const lines =
      doc.splitTextToSize(letter, 170);

    doc.text(lines, 20, 35);

    doc.save(
      `${applicantName}_CoverLetter.pdf`
    );
  };

  const getStatusStyle = (status) => {
    const value = status?.toLowerCase();

    if (value === "accepted") {
      return {
        background:
          "rgba(74, 222, 128, 0.12)",
        color: "#86efac",
        border:
          "1px solid rgba(74, 222, 128, 0.3)",
      };
    }

    if (value === "rejected") {
      return {
        background:
          "rgba(248, 113, 113, 0.12)",
        color: "#fca5a5",
        border:
          "1px solid rgba(248, 113, 113, 0.3)",
      };
    }

    return {
      background:
        "rgba(167, 139, 250, 0.12)",
      color: "#c4b5fd",
      border:
        "1px solid rgba(167, 139, 250, 0.3)",
    };
  };

  const getRecommendation = (score) => {
    if (score >= 80) {
      return "⭐ Highly Recommended";
    }

    if (score >= 50) {
      return "👍 Good Candidate";
    }

    return "⚠ Needs Improvement";
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <main style={styles.container}>

        {/* HERO */}

        <section style={styles.hero}>

          <div style={styles.heroContent}>

            <div style={styles.heroIcon}>
              👥
            </div>

            <div>

              <div style={styles.badge}>
                APPLICANT MANAGEMENT
              </div>

              <h1 style={styles.heroTitle}>
                Manage Your{" "}
                <span style={styles.gradientText}>
                  Applicants
                </span>
              </h1>

              <p style={styles.heroSubtitle}>
                Review candidate profiles, analyze
                resumes and manage applications with
                AI-powered recruitment tools.
              </p>

            </div>

          </div>

          <div style={styles.applicantCount}>
            <strong>
              {applications.length}
            </strong>

            <span>
              Total Applicants
            </span>
          </div>

        </section>


        {/* LOADING */}

        {loading ? (

          <div style={styles.emptyState}>

            <div style={styles.loader}>
              ⏳
            </div>

            <h2 style={styles.emptyTitle}>
              Loading Applicants...
            </h2>

            <p style={styles.emptyText}>
              Please wait while we load the
              applications.
            </p>

          </div>

        ) : applications.length === 0 ? (

          /* EMPTY */

          <div style={styles.emptyState}>

            <div style={styles.emptyIcon}>
              👥
            </div>

            <h2 style={styles.emptyTitle}>
              No Applicants Yet
            </h2>

            <p style={styles.emptyText}>
              Applications for this job will
              appear here.
            </p>

          </div>

        ) : (

          <div style={styles.applicationsList}>

            {applications.map((app) => {

              const applicant =
                app.applicant || {};

              const applicantName =
                applicant.name || "Candidate";

              return (

                <article
                  key={app._id}
                  style={styles.card}
                >

                  {/* TOP SECTION */}

                  <div style={styles.cardTop}>

                    <div style={styles.profileSection}>

                      <img
                        src={
                          applicant.profileImage
                            ?`https://hireflow-ai-9xcf.vercel.app/${applicant.profileImage}`
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                applicantName
                              )}&background=7c3aed&color=ffffff`
                        }
                        alt={applicantName}
                        style={styles.profileImage}
                      />

                      <div>

                        <h2 style={styles.name}>
                          {applicantName}
                        </h2>

                        <p style={styles.email}>
                          ✉️ {applicant.email ||
                            "Email not available"}
                        </p>

                      </div>

                    </div>


                    <div
                      style={{
                        ...styles.status,
                        ...getStatusStyle(
                          app.status
                        ),
                      }}
                    >
                      {app.status === "Accepted"
                        ? "✓ Accepted"
                        : app.status === "Rejected"
                        ? "✕ Rejected"
                        : "◷ Pending"}
                    </div>

                  </div>


                  {/* CANDIDATE INFORMATION */}

                  <div style={styles.infoGrid}>

                    <div style={styles.infoItem}>
                      <span style={styles.infoIcon}>
                        📱
                      </span>

                      <div>
                        <small>Phone</small>

                        <strong>
                          {applicant.phone ||
                            "Not Added"}
                        </strong>
                      </div>
                    </div>


                    <div style={styles.infoItem}>
                      <span style={styles.infoIcon}>
                        📍
                      </span>

                      <div>
                        <small>Location</small>

                        <strong>
                          {applicant.location ||
                            "Not Added"}
                        </strong>
                      </div>
                    </div>


                    <div style={styles.infoItem}>
                      <span style={styles.infoIcon}>
                        🎓
                      </span>

                      <div>
                        <small>Education</small>

                        <strong>
                          {applicant.education ||
                            "Not Added"}
                        </strong>
                      </div>
                    </div>


                    <div style={styles.infoItem}>
                      <span style={styles.infoIcon}>
                        🛠️
                      </span>

                      <div>
                        <small>Skills</small>

                        <strong>
                          {applicant.skills ||
                            "Not Added"}
                        </strong>
                      </div>
                    </div>

                  </div>


                  {/* RESUME */}

                  <div style={styles.resumeSection}>

                    <div>

                      <h3 style={styles.sectionTitle}>
                        📄 Resume
                      </h3>

                      <p style={styles.sectionText}>
                        View the candidate's uploaded
                        resume and professional details.
                      </p>

                    </div>

                    {app.resume ? (

                      <a
                       href={`https://hireflow-ai-9xcf.vercel.app/${app.resume}`}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.resumeButton}
                      >
                        📄 View Resume
                      </a>

                    ) : (

                      <span style={styles.noResume}>
                        No Resume Uploaded
                      </span>

                    )}

                  </div>


                  {/* ACTIONS */}

                  <div style={styles.actionSection}>

                    <h3 style={styles.actionTitle}>
                      ⚡ Applicant Actions
                    </h3>

                    <div style={styles.buttonGrid}>

                      <button
                        onClick={() =>
                          updateStatus(
                            app._id,
                            "Accepted"
                          )
                        }
                        style={styles.acceptButton}
                      >
                        ✓ Accept
                      </button>


                      <button
                        onClick={() =>
                          updateStatus(
                            app._id,
                            "Rejected"
                          )
                        }
                        style={styles.rejectButton}
                      >
                        ✕ Reject
                      </button>


                      <button
                        onClick={() =>
                          analyzeResume(app._id)
                        }
                        style={styles.analyzeButton}
                      >
                        🤖 Analyze Resume
                      </button>


                      <button
                        onClick={() =>
                          generateQuestions(
                            app._id
                          )
                        }
                        style={styles.questionButton}
                      >
                        🎯 Interview Questions
                      </button>


                      <button
                        onClick={() =>
                          generateCoverLetter(
                            app._id
                          )
                        }
                        style={styles.coverLetterButton}
                      >
                        ✨ AI Cover Letter
                      </button>

                    </div>

                  </div>


                  {/* AI RESUME ANALYSIS */}

                  {analysis[app._id] && (

                    <div style={styles.aiBox}>

                      <div style={styles.aiHeader}>

                        <div>

                          <h3 style={styles.aiTitle}>
                            🤖 AI Resume Analysis
                          </h3>

                          <p style={styles.aiSubtitle}>
                            AI-powered candidate matching
                            insights
                          </p>

                        </div>

                        <div style={styles.scoreBox}>
                          <strong>
                            {analysis[app._id].score}%
                          </strong>

                          <span>
                            Match Score
                          </span>
                        </div>

                      </div>


                      <div style={styles.analysisGrid}>

                        <div style={styles.skillBox}>

                          <h4>
                            ✓ Matched Skills
                          </h4>

                          <p>
                            {analysis[app._id]
                              .matchedSkills?.length
                              ? analysis[
                                  app._id
                                ].matchedSkills.join(
                                  ", "
                                )
                              : "None"}
                          </p>

                        </div>


                        <div style={styles.skillBox}>

                          <h4>
                            + Missing Skills
                          </h4>

                          <p>
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

                      </div>


                      <div
                        style={{
                          ...styles.recommendation,
                          color:
                            analysis[app._id].score >= 80
                              ? "#86efac"
                              : analysis[app._id]
                                  .score >= 50
                              ? "#c4b5fd"
                              : "#fca5a5",
                        }}
                      >
                        {getRecommendation(
                          analysis[app._id].score
                        )}
                      </div>

                    </div>

                  )}


                  {/* INTERVIEW QUESTIONS */}

                  {questions[app._id] && (

                    <div style={styles.questionsBox}>

                      <h3 style={styles.aiTitle}>
                        🎯 AI Interview Questions
                      </h3>

                      <p style={styles.aiSubtitle}>
                        Personalized questions generated
                        for this candidate.
                      </p>

                      <ol style={styles.questionList}>

                        {questions[app._id].map(
                          (question, index) => (

                            <li
                              key={index}
                              style={styles.questionItem}
                            >
                              {question}
                            </li>

                          )
                        )}

                      </ol>

                    </div>

                  )}


                  {/* COVER LETTER */}

                  {coverLetters[app._id] && (

                    <div style={styles.coverLetterBox}>

                      <h3 style={styles.aiTitle}>
                        ✨ AI Generated Cover Letter
                      </h3>

                      <div style={styles.letterContent}>
                        {coverLetters[app._id]}
                      </div>

                      <button
                        onClick={() =>
                          downloadPDF(
                            app._id,
                            applicantName
                          )
                        }
                        style={styles.downloadButton}
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
    </div>
  );
}


/* ============================================
   HIRE FLOW AI DARK PURPLE THEME
============================================ */

const styles = {

  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #17161f 0%, #211f2b 50%, #18171f 100%)",
    color: "#f8fafc",
    fontFamily:
      "'Segoe UI', Arial, sans-serif",
  },


  container: {
    width: "min(1300px, calc(100% - 40px))",
    margin: "0 auto",
    padding: "42px 0 70px",
  },


  hero: {
    minHeight: "180px",
    padding: "28px 38px",
    borderRadius: "24px",
    background:
      "linear-gradient(105deg, #243b7a, #3d5ec7 55%, #743de0)",
    boxShadow:
      "0 20px 50px rgba(0,0,0,0.28)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "30px",
    marginBottom: "32px",
  },


  heroContent: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },


  heroIcon: {
    width: "76px",
    height: "76px",
    borderRadius: "20px",
    background:
      "rgba(255,255,255,0.14)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "35px",
    border:
      "1px solid rgba(255,255,255,0.12)",
    flexShrink: 0,
  },


  badge: {
    display: "inline-block",
    padding: "7px 15px",
    borderRadius: "30px",
    background:
      "rgba(255,255,255,0.14)",
    border:
      "1px solid rgba(255,255,255,0.16)",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.1px",
    marginBottom: "9px",
    color: "#ede9fe",
  },


  heroTitle: {
    margin: 0,
    fontSize: "42px",
    fontWeight: "800",
    letterSpacing: "-1px",
  },


  gradientText: {
    color: "#e9ddff",
  },


  heroSubtitle: {
    margin: "8px 0 0",
    color: "#dbeafe",
    fontSize: "15px",
    maxWidth: "700px",
    lineHeight: "1.6",
  },


  applicantCount: {
    minWidth: "130px",
    padding: "22px",
    borderRadius: "20px",
    background:
      "rgba(20,18,30,0.18)",
    border:
      "1px solid rgba(255,255,255,0.18)",
    textAlign: "center",
    backdropFilter: "blur(10px)",
  },


  applicantCountStrong: {
    display: "block",
  },


  emptyState: {
    padding: "70px 30px",
    borderRadius: "22px",
    background:
      "linear-gradient(145deg, #302f39, #282730)",
    border: "1px solid #444250",
    textAlign: "center",
    boxShadow:
      "0 15px 40px rgba(0,0,0,0.2)",
  },


  emptyIcon: {
    fontSize: "52px",
    marginBottom: "15px",
  },


  loader: {
    fontSize: "45px",
    marginBottom: "15px",
  },


  emptyTitle: {
    margin: 0,
    color: "#f5f3ff",
    fontSize: "24px",
  },


  emptyText: {
    marginTop: "10px",
    color: "#a8a5b5",
    fontSize: "14px",
  },


  applicationsList: {
    display: "flex",
    flexDirection: "column",
    gap: "26px",
  },


  card: {
    padding: "30px",
    borderRadius: "24px",
    background:
      "linear-gradient(145deg, #302f39, #292830)",
    border: "1px solid #464452",
    boxShadow:
      "0 18px 45px rgba(0,0,0,0.22)",
  },


  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    paddingBottom: "25px",
    borderBottom:
      "1px solid #44424e",
  },


  profileSection: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },


  profileImage: {
    width: "78px",
    height: "78px",
    borderRadius: "22px",
    objectFit: "cover",
    border:
      "3px solid rgba(139,92,246,0.75)",
    boxShadow:
      "0 10px 25px rgba(124,58,237,0.22)",
  },


  name: {
    margin: 0,
    fontSize: "25px",
    color: "#f8fafc",
  },


  email: {
    margin: "7px 0 0",
    color: "#aaa7b5",
    fontSize: "14px",
  },


  status: {
    padding: "9px 15px",
    borderRadius: "30px",
    fontSize: "12px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },


  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "15px",
    marginTop: "25px",
  },


  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    borderRadius: "16px",
    background:
      "rgba(255,255,255,0.035)",
    border:
      "1px solid rgba(255,255,255,0.07)",
  },


  infoIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background:
      "rgba(124,58,237,0.16)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    flexShrink: 0,
  },


  resumeSection: {
    marginTop: "22px",
    padding: "20px",
    borderRadius: "18px",
    background:
      "rgba(255,255,255,0.035)",
    border:
      "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  },


  sectionTitle: {
    margin: 0,
    color: "#f5f3ff",
    fontSize: "17px",
  },


  sectionText: {
    margin: "5px 0 0",
    color: "#a8a5b5",
    fontSize: "13px",
  },


  resumeButton: {
    padding: "11px 18px",
    borderRadius: "10px",
    background:
      "rgba(124,58,237,0.16)",
    border:
      "1px solid rgba(167,139,250,0.4)",
    color: "#ddd6fe",
    fontWeight: "700",
    fontSize: "13px",
    textDecoration: "none",
    whiteSpace: "nowrap",
  },


  noResume: {
    color: "#aaa7b5",
    fontSize: "13px",
  },


  actionSection: {
    marginTop: "25px",
    paddingTop: "22px",
    borderTop:
      "1px solid #44424e",
  },


  actionTitle: {
    margin: "0 0 15px",
    color: "#f5f3ff",
    fontSize: "18px",
  },


  buttonGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },


  acceptButton: {
    border: "none",
    padding: "11px 18px",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg, #15803d, #22c55e)",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  },


  rejectButton: {
    border: "none",
    padding: "11px 18px",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg, #b91c1c, #ef4444)",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  },


  analyzeButton: {
    border: "1px solid rgba(167,139,250,0.4)",
    padding: "11px 18px",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg, #5b21b6, #7c3aed)",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  },


  questionButton: {
    border:
      "1px solid rgba(139,92,246,0.4)",
    padding: "11px 18px",
    borderRadius: "10px",
    background:
      "rgba(124,58,237,0.18)",
    color: "#ddd6fe",
    fontWeight: "700",
    cursor: "pointer",
  },


  coverLetterButton: {
    border:
      "1px solid rgba(192,132,252,0.4)",
    padding: "11px 18px",
    borderRadius: "10px",
    background:
      "rgba(168,85,247,0.16)",
    color: "#e9d5ff",
    fontWeight: "700",
    cursor: "pointer",
  },


  aiBox: {
    marginTop: "25px",
    padding: "24px",
    borderRadius: "20px",
    background:
      "linear-gradient(145deg, rgba(76,29,149,0.2), rgba(49,46,129,0.1))",
    border:
      "1px solid rgba(139,92,246,0.28)",
  },


  aiHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },


  aiTitle: {
    margin: 0,
    color: "#f5f3ff",
    fontSize: "19px",
  },


  aiSubtitle: {
    margin: "6px 0 0",
    color: "#aaa7b5",
    fontSize: "13px",
  },


  scoreBox: {
    minWidth: "100px",
    padding: "12px",
    borderRadius: "14px",
    textAlign: "center",
    background:
      "rgba(124,58,237,0.16)",
    border:
      "1px solid rgba(167,139,250,0.25)",
  },


  analysisGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },


  skillBox: {
    padding: "16px",
    borderRadius: "14px",
    background:
      "rgba(255,255,255,0.04)",
    border:
      "1px solid rgba(255,255,255,0.06)",
  },


  recommendation: {
    marginTop: "18px",
    padding: "13px 16px",
    borderRadius: "12px",
    background:
      "rgba(255,255,255,0.04)",
    fontWeight: "700",
  },


  questionsBox: {
    marginTop: "25px",
    padding: "24px",
    borderRadius: "20px",
    background:
      "rgba(124,58,237,0.08)",
    border:
      "1px solid rgba(139,92,246,0.25)",
  },


  questionList: {
    margin: "20px 0 0",
    paddingLeft: "22px",
  },


  questionItem: {
    marginBottom: "14px",
    padding: "13px",
    borderRadius: "10px",
    background:
      "rgba(255,255,255,0.035)",
    color: "#d6d3df",
    lineHeight: "1.6",
  },


  coverLetterBox: {
    marginTop: "25px",
    padding: "24px",
    borderRadius: "20px",
    background:
      "linear-gradient(145deg, rgba(109,40,217,0.14), rgba(124,58,237,0.06))",
    border:
      "1px solid rgba(167,139,250,0.25)",
  },


  letterContent: {
    marginTop: "18px",
    padding: "18px",
    borderRadius: "14px",
    background:
      "rgba(0,0,0,0.16)",
    color: "#d6d3df",
    lineHeight: "1.8",
    whiteSpace: "pre-wrap",
  },


  downloadButton: {
    marginTop: "18px",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg, #6d28d9, #9333ea)",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  },

};


export default ViewApplicants;