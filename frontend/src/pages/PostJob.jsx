import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function PostJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salaryRange: "",
    description: "",
    skills: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitJob = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const jobData = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== ""),
      };

      await API.post("/jobs", jobData);

      alert("Job Posted Successfully! ✅");

      navigate("/employer-dashboard");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to post job"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="post-job-page">

        {/* =========================
            HEADER
        ========================= */}

        <div className="post-job-header">

          <div className="header-icon">
            💼
          </div>

          <div>
            <div className="header-badge">
              EMPLOYER RECRUITMENT
            </div>

            <h1>
              Post a New Job
            </h1>

            <p>
              Create a professional job posting and
              connect with talented candidates.
            </p>
          </div>

        </div>


        {/* =========================
            FORM CARD
        ========================= */}

        <div className="post-job-card">

          <form onSubmit={submitJob}>

            {/* =====================
                JOB INFORMATION
            ===================== */}

            <div className="section-header">

              <div className="section-icon">
                📋
              </div>

              <div>
                <h2>
                  Job Information
                </h2>

                <p>
                  Enter the basic details of the position.
                </p>
              </div>

            </div>


            <div className="form-grid">

              {/* JOB TITLE */}

              <div className="field">

                <label>
                  Job Title
                </label>

                <div className="input-wrapper">

                  <span>
                    💼
                  </span>

                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Frontend Developer"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* COMPANY */}

              <div className="field">

                <label>
                  Company
                </label>

                <div className="input-wrapper">

                  <span>
                    🏢
                  </span>

                  <input
                    type="text"
                    name="company"
                    placeholder="e.g. HireFlow Technologies"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* LOCATION */}

              <div className="field">

                <label>
                  Location
                </label>

                <div className="input-wrapper">

                  <span>
                    📍
                  </span>

                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Pune, Maharashtra"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* SALARY */}

              <div className="field">

                <label>
                  Salary Range
                </label>

                <div className="input-wrapper">

                  <span>
                    💰
                  </span>

                  <input
                    type="text"
                    name="salaryRange"
                    placeholder="e.g. ₹5 - ₹8 LPA"
                    value={formData.salaryRange}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

            </div>


            {/* =====================
                DESCRIPTION
            ===================== */}

            <div className="section-header section-space">

              <div className="section-icon">
                📝
              </div>

              <div>
                <h2>
                  Job Description
                </h2>

                <p>
                  Explain the role, responsibilities and
                  expectations.
                </p>
              </div>

            </div>


            <div className="field">

              <label>
                Description
              </label>

              <div className="textarea-wrapper">

                <span>
                  📄
                </span>

                <textarea
                  name="description"
                  placeholder="Describe the responsibilities, requirements and expectations for this position..."
                  rows="7"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />

              </div>

              <small>
                Provide enough detail to help candidates
                understand the role clearly.
              </small>

            </div>


            {/* =====================
                SKILLS
            ===================== */}

            <div className="section-header section-space">

              <div className="section-icon">
                🧠
              </div>

              <div>
                <h2>
                  Required Skills
                </h2>

                <p>
                  Add the technical skills required for
                  this position.
                </p>
              </div>

            </div>


            <div className="field">

              <label>
                Skills
              </label>

              <div className="input-wrapper">

                <span>
                  🛠️
                </span>

                <input
                  type="text"
                  name="skills"
                  placeholder="React, Node.js, MongoDB, Express"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                />

              </div>

              <small>
                💡 Separate multiple skills using commas.
              </small>

            </div>


            {/* =====================
                SKILL PREVIEW
            ===================== */}

            {formData.skills.trim() && (

              <div className="skill-preview">

                <div className="preview-title">
                  ✨ Skill Preview
                </div>

                <div className="skill-tags">

                  {formData.skills
                    .split(",")
                    .map((skill) =>
                      skill.trim()
                    )
                    .filter(Boolean)
                    .map((skill, index) => (

                      <span
                        key={index}
                        className="skill-tag"
                      >
                        {skill}
                      </span>

                    ))}

                </div>

              </div>

            )}


            {/* =====================
                ACTIONS
            ===================== */}

            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  navigate("/employer-dashboard")
                }
                disabled={loading}
              >
                ← Cancel
              </button>


              <button
                type="submit"
                className="publish-button"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Posting...
                  </>
                ) : (
                  <>
                    🚀 Post Job
                  </>
                )}

              </button>

            </div>

          </form>

        </div>


        {/* =========================
            TIP
        ========================= */}

        <div className="tip-card">

          <div className="tip-icon">
            💡
          </div>

          <div>
            <strong>
              Hiring Tip
            </strong>

            <p>
              Clear descriptions and relevant skills
              help attract better-matched candidates.
            </p>
          </div>

        </div>

      </div>


      {/* =========================
          CSS
      ========================= */}

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


        /* =========================
           PAGE
        ========================= */

        .post-job-page {
          width: 100%;
          max-width: 1050px;

          margin: 0 auto;

          padding:
            40px 24px 70px;

          color: #111827;
        }


        /* =========================
           HEADER
        ========================= */

        .post-job-header {
          display: flex;

          align-items: center;

          gap: 18px;

          margin-bottom: 28px;

          padding: 24px;

          border-radius: 18px;

          background:
            linear-gradient(
              135deg,
              #1e3a8a,
              #2563eb,
              #7c3aed
            );

          color: white;

          box-shadow:
            0 15px 35px
            rgba(37,99,235,.2);
        }

        .header-icon {
          width: 58px;
          height: 58px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 15px;

          background:
            rgba(255,255,255,.14);

          font-size: 25px;
        }

        .header-badge {
          display: inline-block;

          margin-bottom: 5px;

          padding:
            5px 9px;

          border-radius: 20px;

          background:
            rgba(255,255,255,.12);

          font-size: 9px;

          font-weight: 800;

          letter-spacing: 1px;
        }

        .post-job-header h1 {
          margin: 0;

          color: white;

          font-size: 31px;

          line-height: 1.2;

          font-weight: 850;
        }

        .post-job-header p {
          margin:
            5px 0 0;

          color:
            rgba(255,255,255,.82);

          font-size: 12px;

          line-height: 1.5;
        }


        /* =========================
           CARD
        ========================= */

        .post-job-card {
          width: 100%;

          padding: 32px;

          border-radius: 19px;

          background: white;

          border:
            1px solid #e2e8f0;

          box-shadow:
            0 12px 35px
            rgba(15,23,42,.08);
        }


        /* =========================
           SECTION HEADER
        ========================= */

        .section-header {
          display: flex;

          align-items: center;

          gap: 12px;

          margin-bottom: 20px;

          padding-bottom: 17px;

          border-bottom:
            1px solid #e5e7eb;
        }

        .section-space {
          margin-top: 30px;
        }

        .section-icon {
          width: 40px;
          height: 40px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 10px;

          background:
            #eff6ff;

          font-size: 18px;
        }

        .section-header h2 {
          margin: 0;

          color: #111827;

          font-size: 19px;

          font-weight: 800;
        }

        .section-header p {
          margin:
            3px 0 0;

          color: #64748b;

          font-size: 11px;
        }


        /* =========================
           FORM GRID
        ========================= */

        .form-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 18px;

          width: 100%;
        }


        /* =========================
           FIELD
        ========================= */

        .field {
          width: 100%;

          min-width: 0;
        }

        .field label {
          display: block;

          margin-bottom: 7px;

          color: #374151;

          font-size: 11px;

          font-weight: 800;
        }


        /* =========================
           INPUT
        ========================= */

        .input-wrapper {
          width: 100%;

          min-width: 0;

          height: 49px;

          display: flex;

          align-items: center;

          gap: 8px;

          padding:
            0 12px;

          border-radius: 10px;

          background:
            #f8fafc;

          border:
            1px solid #dbe3ef;

          transition:
            .2s ease;

          overflow: hidden;
        }

        .input-wrapper:focus-within {
          background: white;

          border-color:
            #2563eb;

          box-shadow:
            0 0 0 3px
            rgba(37,99,235,.08);
        }

        .input-wrapper span {
          flex-shrink: 0;

          font-size: 14px;
        }

        .input-wrapper input {
          width: 100%;

          min-width: 0;

          height: 100%;

          border: none;

          outline: none;

          background: transparent;

          color: #111827;

          font-size: 12px;
        }

        .input-wrapper input::placeholder {
          color: #94a3b8;
        }


        /* =========================
           TEXTAREA
        ========================= */

        .textarea-wrapper {
          width: 100%;

          display: flex;

          align-items: flex-start;

          gap: 9px;

          padding:
            11px 12px;

          border-radius: 10px;

          background:
            #f8fafc;

          border:
            1px solid #dbe3ef;

          transition:
            .2s ease;
        }

        .textarea-wrapper:focus-within {
          background: white;

          border-color:
            #2563eb;

          box-shadow:
            0 0 0 3px
            rgba(37,99,235,.08);
        }

        .textarea-wrapper span {
          flex-shrink: 0;

          font-size: 14px;

          margin-top: 2px;
        }

        .textarea-wrapper textarea {
          width: 100%;

          min-width: 0;

          min-height: 140px;

          border: none;

          outline: none;

          resize: vertical;

          background: transparent;

          color: #111827;

          font-family:
            "Segoe UI",
            Arial,
            sans-serif;

          font-size: 12px;

          line-height: 1.6;
        }

        .textarea-wrapper textarea::placeholder {
          color: #94a3b8;
        }

        .field small {
          display: block;

          margin-top: 6px;

          color: #94a3b8;

          font-size: 9px;

          line-height: 1.5;
        }


        /* =========================
           SKILL PREVIEW
        ========================= */

        .skill-preview {
          margin-top: 15px;

          padding: 14px;

          border-radius: 11px;

          background:
            linear-gradient(
              135deg,
              #eff6ff,
              #f5f3ff
            );

          border:
            1px solid #dbeafe;
        }

        .preview-title {
          margin-bottom: 8px;

          color: #334155;

          font-size: 10px;

          font-weight: 800;
        }

        .skill-tags {
          display: flex;

          flex-wrap: wrap;

          gap: 7px;
        }

        .skill-tag {
          padding:
            6px 10px;

          border-radius: 20px;

          background: white;

          border:
            1px solid #bfdbfe;

          color: #2563eb;

          font-size: 9px;

          font-weight: 700;

          word-break: break-word;
        }


        /* =========================
           ACTIONS
        ========================= */

        .form-actions {
          display: flex;

          justify-content: flex-end;

          gap: 11px;

          margin-top: 30px;

          padding-top: 22px;

          border-top:
            1px solid #e5e7eb;
        }

        .form-actions button {
          height: 45px;

          padding:
            0 20px;

          border-radius: 9px;

          font-size: 11px;

          font-weight: 800;

          cursor: pointer;

          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .form-actions button:hover {
          transform:
            translateY(-2px);
        }

        .cancel-button {
          border:
            1px solid #cbd5e1;

          background: white;

          color: #475569;
        }

        .publish-button {
          display: flex;

          align-items: center;

          justify-content: center;

          gap: 7px;

          min-width: 135px;

          border: none;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #7c3aed
            );

          color: white;

          box-shadow:
            0 8px 18px
            rgba(37,99,235,.2);
        }

        .publish-button:disabled {
          opacity: .7;

          cursor:
            not-allowed;
        }


        /* =========================
           SPINNER
        ========================= */

        .spinner {
          width: 14px;
          height: 14px;

          border:
            2px solid
            rgba(255,255,255,.35);

          border-top-color:
            white;

          border-radius: 50%;

          animation:
            spin .7s linear infinite;
        }

        @keyframes spin {
          to {
            transform:
              rotate(360deg);
          }
        }


        /* =========================
           TIP
        ========================= */

        .tip-card {
          width: 100%;

          display: flex;

          align-items: center;

          gap: 11px;

          margin-top: 15px;

          padding:
            13px 15px;

          border-radius: 11px;

          background:
            #eff6ff;

          border:
            1px solid #dbeafe;
        }

        .tip-icon {
          width: 34px;
          height: 34px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 9px;

          background: white;

          font-size: 16px;
        }

        .tip-card strong {
          color: #1e3a8a;

          font-size: 10px;
        }

        .tip-card p {
          margin:
            2px 0 0;

          color: #64748b;

          font-size: 9px;

          line-height: 1.5;
        }


        /* =========================
           TABLET
        ========================= */

        @media (max-width: 800px) {

          .form-grid {
            grid-template-columns: 1fr;
          }

        }


        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 600px) {

          .post-job-page {
            padding:
              25px 12px 45px;
          }

          .post-job-header {
            padding: 18px;

            gap: 12px;

            border-radius: 15px;
          }

          .header-icon {
            width: 45px;
            height: 45px;

            border-radius: 11px;

            font-size: 20px;
          }

          .post-job-header h1 {
            font-size: 23px;
          }

          .post-job-header p {
            font-size: 10px;
          }

          .post-job-card {
            padding: 18px;

            border-radius: 15px;
          }

          .section-header h2 {
            font-size: 17px;
          }

          .section-header p {
            font-size: 9px;
          }

          .form-actions {
            flex-direction:
              column-reverse;
          }

          .form-actions button {
            width: 100%;
          }

          .tip-card {
            align-items:
              flex-start;
          }

        }


        /* =========================
           SMALL MOBILE
        ========================= */

        @media (max-width: 380px) {

          .post-job-page {
            padding-left: 8px;
            padding-right: 8px;
          }

          .post-job-card {
            padding: 14px;
          }

          .post-job-header {
            padding: 14px;
          }

          .post-job-header h1 {
            font-size: 20px;
          }

        }

      `}</style>

    </>
  );
}

export default PostJob;