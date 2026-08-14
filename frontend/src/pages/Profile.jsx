import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    education: "",
    skills: "",
    profileImage: "",
    resume: "",
  });

  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [resume, setResume] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/profile");
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("name", user.name);
      formData.append("phone", user.phone);
      formData.append("location", user.location);
      formData.append("education", user.education);
      formData.append("skills", user.skills);

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      if (resume) {
        formData.append("resume", resume);
      }

      await API.put("/users/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile Updated Successfully ✅");

      setProfileImage(null);
      setResume(null);
      setEditing(false);

      fetchProfile();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setProfileImage(null);
    setResume(null);
    fetchProfile();
  };

  const avatarUrl = user.profileImage
    ? `http://localhost:5000/${user.profileImage}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.name || "User"
    )}&background=2563eb&color=fff&size=200`;

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-container">

        {/* =========================
            PROFILE HERO
        ========================= */}

        <section className="profile-hero">

          <div className="hero-content">

            <div className="profile-avatar-wrapper">

              <img
                src={avatarUrl}
                alt="Profile"
                className="profile-avatar"
              />

              {editing && (
                <label
                  htmlFor="profileImage"
                  className="camera-button"
                  title="Change profile photo"
                >
                  📷
                </label>
              )}

            </div>


            <div className="profile-heading">

              <span className="profile-badge">
                👤 Candidate Profile
              </span>

              <h1>
                {user.name || "Your Profile"}
              </h1>

              <p>
                {user.email ||
                  "Complete your profile to improve your opportunities."}
              </p>

            </div>

          </div>


          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="hero-edit-button"
            >
              ✏️ Edit Profile
            </button>
          )}

        </section>


        {/* =========================
            PROFILE CONTENT
        ========================= */}

        <section className="profile-card">

          <div className="card-header">

            <div>
              <h2>Personal Information</h2>

              <p>
                Keep your information up to date.
              </p>
            </div>

            {!editing && (
              <span className="verified-badge">
                ✓ Profile
              </span>
            )}

          </div>


          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {/* NAME */}

              <div className="field">

                <label>
                  Full Name
                </label>

                <div className="input-wrapper">

                  <span>👤</span>

                  <input
                    type="text"
                    name="name"
                    value={user.name || ""}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="Enter your full name"
                  />

                </div>

              </div>


              {/* EMAIL */}

              <div className="field">

                <label>
                  Email Address
                </label>

                <div className="input-wrapper disabled-input">

                  <span>✉️</span>

                  <input
                    type="email"
                    value={user.email || ""}
                    disabled
                    placeholder="Your email"
                  />

                  <small>
                    🔒
                  </small>

                </div>

              </div>


              {/* PHONE */}

              <div className="field">

                <label>
                  Phone Number
                </label>

                <div className="input-wrapper">

                  <span>📱</span>

                  <input
                    type="text"
                    name="phone"
                    value={user.phone || ""}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="Enter phone number"
                  />

                </div>

              </div>


              {/* LOCATION */}

              <div className="field">

                <label>
                  Location
                </label>

                <div className="input-wrapper">

                  <span>📍</span>

                  <input
                    type="text"
                    name="location"
                    value={user.location || ""}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="City, State"
                  />

                </div>

              </div>


              {/* EDUCATION */}

              <div className="field full-width">

                <label>
                  Education
                </label>

                <div className="input-wrapper">

                  <span>🎓</span>

                  <input
                    type="text"
                    name="education"
                    value={user.education || ""}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="B.E. Computer Engineering"
                  />

                </div>

              </div>


              {/* SKILLS */}

              <div className="field full-width">

                <label>
                  Skills
                </label>

                <div className="textarea-wrapper">

                  <textarea
                    rows="4"
                    name="skills"
                    value={user.skills || ""}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="React, Node.js, MongoDB, JavaScript..."
                  />

                </div>

                {editing && (
                  <small className="field-hint">
                    💡 Separate multiple skills with commas.
                  </small>
                )}

              </div>

            </div>


            {/* =========================
                DOCUMENTS
            ========================= */}

            <div className="documents-section">

              <div className="section-title">

                <div>
                  <h2>
                    Documents
                  </h2>

                  <p>
                    Manage your profile photo and resume.
                  </p>
                </div>

              </div>


              <div className="document-grid">

                {/* PROFILE IMAGE */}

                <div className="document-card">

                  <div className="document-icon">
                    🖼️
                  </div>

                  <div className="document-info">

                    <strong>
                      Profile Photo
                    </strong>

                    <span>
                      JPG, PNG or WEBP
                    </span>

                  </div>

                  {editing && (
                    <label
                      htmlFor="profileImage"
                      className="upload-button"
                    >
                      Choose
                    </label>
                  )}

                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    disabled={!editing}
                    onChange={(e) =>
                      setProfileImage(
                        e.target.files[0]
                      )
                    }
                    hidden
                  />

                </div>


                {/* RESUME */}

                <div className="document-card">

                  <div className="document-icon resume-icon">
                    📄
                  </div>

                  <div className="document-info">

                    <strong>
                      Resume
                    </strong>

                    <span>
                      PDF format only
                    </span>

                  </div>

                  {editing && (
                    <label
                      htmlFor="resume"
                      className="upload-button"
                    >
                      Choose
                    </label>
                  )}

                  <input
                    id="resume"
                    type="file"
                    accept=".pdf"
                    disabled={!editing}
                    onChange={(e) =>
                      setResume(
                        e.target.files[0]
                      )
                    }
                    hidden
                  />

                </div>

              </div>


              {/* SELECTED FILES */}

              {profileImage && (
                <div className="selected-file">
                  🖼️ Selected photo:
                  <strong>
                    {" "}
                    {profileImage.name}
                  </strong>
                </div>
              )}

              {resume && (
                <div className="selected-file">
                  📄 Selected resume:
                  <strong>
                    {" "}
                    {resume.name}
                  </strong>
                </div>
              )}


              {/* EXISTING RESUME */}

              {user.resume && (
                <a
                  href={`http://localhost:5000/${user.resume}`}
                  target="_blank"
                  rel="noreferrer"
                  className="resume-link"
                >
                  📄 View Current Resume
                  <span>↗</span>
                </a>
              )}

            </div>


            {/* =========================
                ACTION BUTTONS
            ========================= */}

            {editing && (
              <div className="form-actions">

                <button
                  type="button"
                  onClick={cancelEdit}
                  className="cancel-button"
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                  disabled={saving}
                >
                  {saving
                    ? "⏳ Saving..."
                    : "💾 Save Changes"}
                </button>

              </div>
            )}

          </form>

        </section>


        {/* =========================
            PROFILE TIP
        ========================= */}

        <div className="profile-tip">

          <div className="tip-icon">
            ✨
          </div>

          <div>

            <strong>
              Complete your profile
            </strong>

            <p>
              A complete profile helps employers
              understand your skills and experience
              faster.
            </p>

          </div>

        </div>

      </main>


      {/* =========================
          PAGE CSS
      ========================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .profile-page {
          min-height: 100vh;

          background:
            linear-gradient(
              135deg,
              #f5f7ff 0%,
              #eef4ff 50%,
              #f8f5ff 100%
            );

          font-family:
            "Segoe UI",
            Arial,
            sans-serif;

          color: #172554;

          padding-bottom: 60px;
        }


        .profile-container {
          width:
            min(
              1050px,
              calc(100% - 40px)
            );

          margin: 0 auto;

          padding-top: 35px;
        }


        /* =========================
           HERO
        ========================= */

        .profile-hero {
          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 25px;

          padding: 28px 32px;

          border-radius: 22px;

          background:
            linear-gradient(
              135deg,
              #172554,
              #2563eb 55%,
              #7c3aed
            );

          color: white;

          box-shadow:
            0 15px 40px
            rgba(37,99,235,.22);

          margin-bottom: 25px;
        }


        .hero-content {
          display: flex;

          align-items: center;

          gap: 22px;
        }


        .profile-avatar-wrapper {
          position: relative;

          flex-shrink: 0;
        }


        .profile-avatar {
          width: 115px;

          height: 115px;

          border-radius: 50%;

          object-fit: cover;

          border:
            4px solid
            rgba(255,255,255,.9);

          box-shadow:
            0 8px 25px
            rgba(0,0,0,.22);
        }


        .camera-button {
          position: absolute;

          right: 3px;

          bottom: 5px;

          width: 35px;

          height: 35px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 50%;

          background: white;

          color: #2563eb;

          cursor: pointer;

          box-shadow:
            0 4px 12px
            rgba(0,0,0,.2);

          font-size: 15px;
        }


        .profile-badge {
          display: inline-block;

          padding: 6px 11px;

          border-radius: 20px;

          background:
            rgba(255,255,255,.14);

          border:
            1px solid
            rgba(255,255,255,.18);

          font-size: 11px;

          font-weight: 700;

          margin-bottom: 9px;
        }


        .profile-heading h1 {
          margin: 0;

          font-size: 31px;

          font-weight: 800;
        }


        .profile-heading p {
          margin: 6px 0 0;

          color:
            rgba(255,255,255,.78);

          font-size: 13px;
        }


        .hero-edit-button {
          border: 1px solid
            rgba(255,255,255,.3);

          background:
            rgba(255,255,255,.12);

          color: white;

          padding: 11px 17px;

          border-radius: 9px;

          font-weight: 700;

          cursor: pointer;

          transition: .2s;
        }


        .hero-edit-button:hover {
          background:
            rgba(255,255,255,.22);

          transform:
            translateY(-1px);
        }


        /* =========================
           CARD
        ========================= */

        .profile-card {
          background: white;

          border:
            1px solid #e2e8f0;

          border-radius: 20px;

          padding: 30px;

          box-shadow:
            0 10px 30px
            rgba(15,23,42,.07);
        }


        .card-header {
          display: flex;

          justify-content: space-between;

          align-items: flex-start;

          padding-bottom: 20px;

          margin-bottom: 25px;

          border-bottom:
            1px solid #e2e8f0;
        }


        .card-header h2,
        .section-title h2 {
          margin: 0;

          color: #172554;

          font-size: 20px;
        }


        .card-header p,
        .section-title p {
          margin: 5px 0 0;

          color: #64748b;

          font-size: 13px;
        }


        .verified-badge {
          padding: 7px 11px;

          border-radius: 20px;

          background: #ecfdf5;

          color: #15803d;

          font-size: 11px;

          font-weight: 700;
        }


        /* =========================
           FORM
        ========================= */

        .form-grid {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 22px;
        }


        .field {
          display: flex;

          flex-direction: column;
        }


        .full-width {
          grid-column: 1 / -1;
        }


        .field label {
          margin-bottom: 8px;

          color: #334155;

          font-size: 12px;

          font-weight: 700;
        }


        .input-wrapper {
          display: flex;

          align-items: center;

          gap: 10px;

          height: 47px;

          padding: 0 13px;

          border:
            1px solid #dbe3ef;

          border-radius: 10px;

          background: #f8fafc;

          transition: .2s;
        }


        .input-wrapper:focus-within {
          border-color: #2563eb;

          background: white;

          box-shadow:
            0 0 0 3px
            rgba(37,99,235,.09);
        }


        .input-wrapper input {
          width: 100%;

          height: 100%;

          border: none;

          outline: none;

          background: transparent;

          color: #172554;

          font-size: 13px;
        }


        .input-wrapper input:disabled {
          color: #64748b;

          cursor: not-allowed;
        }


        .disabled-input {
          background: #f1f5f9;
        }


        .disabled-input small {
          color: #94a3b8;
        }


        .textarea-wrapper {
          border:
            1px solid #dbe3ef;

          border-radius: 10px;

          background: #f8fafc;

          padding: 10px 13px;

          transition: .2s;
        }


        .textarea-wrapper:focus-within {
          border-color: #2563eb;

          background: white;

          box-shadow:
            0 0 0 3px
            rgba(37,99,235,.09);
        }


        .textarea-wrapper textarea {
          width: 100%;

          border: none;

          outline: none;

          resize: vertical;

          background: transparent;

          font-family:
            "Segoe UI",
            Arial,
            sans-serif;

          color: #172554;

          font-size: 13px;

          line-height: 1.6;
        }


        .textarea-wrapper textarea:disabled {
          color: #64748b;

          cursor: not-allowed;
        }


        .field-hint {
          margin-top: 6px;

          color: #64748b;

          font-size: 11px;
        }


        /* =========================
           DOCUMENTS
        ========================= */

        .documents-section {
          margin-top: 35px;

          padding-top: 28px;

          border-top:
            1px solid #e2e8f0;
        }


        .section-title {
          margin-bottom: 18px;
        }


        .document-grid {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 15px;
        }


        .document-card {
          display: flex;

          align-items: center;

          gap: 13px;

          padding: 15px;

          border:
            1px solid #e2e8f0;

          border-radius: 12px;

          background: #f8fafc;
        }


        .document-icon {
          width: 43px;

          height: 43px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 10px;

          background: #eff6ff;

          font-size: 20px;

          flex-shrink: 0;
        }


        .resume-icon {
          background: #fff7ed;
        }


        .document-info {
          display: flex;

          flex-direction: column;

          flex: 1;

          gap: 3px;
        }


        .document-info strong {
          color: #172554;

          font-size: 13px;
        }


        .document-info span {
          color: #64748b;

          font-size: 10px;
        }


        .upload-button {
          padding: 8px 12px;

          border-radius: 7px;

          background: #2563eb;

          color: white;

          font-size: 11px;

          font-weight: 700;

          cursor: pointer;
        }


        .selected-file {
          margin-top: 10px;

          padding: 10px 12px;

          border-radius: 8px;

          background: #eff6ff;

          color: #1d4ed8;

          font-size: 11px;
        }


        .resume-link {
          display: inline-flex;

          align-items: center;

          gap: 8px;

          margin-top: 14px;

          color: #2563eb;

          font-size: 13px;

          font-weight: 700;

          text-decoration: none;
        }


        .resume-link:hover {
          text-decoration: underline;
        }


        /* =========================
           ACTIONS
        ========================= */

        .form-actions {
          display: flex;

          justify-content: flex-end;

          gap: 12px;

          margin-top: 30px;

          padding-top: 22px;

          border-top:
            1px solid #e2e8f0;
        }


        .form-actions button {
          min-width: 140px;

          padding: 12px 18px;

          border-radius: 9px;

          font-size: 13px;

          font-weight: 700;

          cursor: pointer;

          transition: .2s;
        }


        .cancel-button {
          border:
            1px solid #cbd5e1;

          background: white;

          color: #475569;
        }


        .cancel-button:hover {
          background: #f8fafc;
        }


        .save-button {
          border: none;

          color: white;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #7c3aed
            );

          box-shadow:
            0 7px 18px
            rgba(37,99,235,.20);
        }


        .save-button:hover {
          transform:
            translateY(-1px);

          box-shadow:
            0 10px 22px
            rgba(37,99,235,.25);
        }


        /* =========================
           TIP
        ========================= */

        .profile-tip {
          display: flex;

          align-items: center;

          gap: 14px;

          margin-top: 20px;

          padding: 17px 20px;

          border-radius: 14px;

          background:
            linear-gradient(
              135deg,
              #eef4ff,
              #f5f3ff
            );

          border:
            1px solid #dbeafe;
        }


        .tip-icon {
          width: 40px;

          height: 40px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 10px;

          background: white;

          font-size: 19px;
        }


        .profile-tip strong {
          font-size: 13px;

          color: #172554;
        }


        .profile-tip p {
          margin: 3px 0 0;

          color: #64748b;

          font-size: 11px;
        }


        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 700px) {

          .profile-container {
            width:
              calc(100% - 24px);

            padding-top: 20px;
          }


          .profile-hero {
            flex-direction: column;

            align-items: flex-start;

            padding: 22px;
          }


          .hero-content {
            flex-direction: column;

            align-items: flex-start;
          }


          .profile-heading h1 {
            font-size: 25px;
          }


          .hero-edit-button {
            width: 100%;
          }


          .profile-card {
            padding: 20px;
          }


          .form-grid {
            grid-template-columns: 1fr;
          }


          .full-width {
            grid-column: auto;
          }


          .document-grid {
            grid-template-columns: 1fr;
          }


          .form-actions {
            flex-direction: column-reverse;
          }


          .form-actions button {
            width: 100%;
          }

        }

      `}</style>
    </div>
  );
}

export default Profile;