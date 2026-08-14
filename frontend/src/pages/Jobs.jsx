import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function Jobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const res = await API.get("/jobs", {
        params: {
          search,
          company,
          location,
          sort,
          page,
        },
      });

      setJobs(res.data.jobs || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchJobs = async () => {
    try {
      setLoading(true);
      setPage(1);

      const res = await API.get("/jobs", {
        params: {
          search,
          company,
          location,
          sort,
          page: 1,
        },
      });

      setJobs(res.data.jobs || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = async () => {
    setSearch("");
    setCompany("");
    setLocation("");
    setSort("newest");
    setPage(1);

    try {
      setLoading(true);

      const res = await API.get("/jobs");

      setJobs(res.data.jobs || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveJob = async (jobId) => {
    try {
      await API.post(`/saved-jobs/${jobId}`);

      setSavedIds((prev) =>
        prev.includes(jobId)
          ? prev
          : [...prev, jobId]
      );

      alert("❤️ Job Saved Successfully");
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to save job"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="jobs-page">
        <section className="hero">
          <div className="badge">
            ✨ SMART JOB DISCOVERY
          </div>

          <h1>
            Find Your <span>Dream Job</span>
          </h1>

          <p>
            Discover opportunities that match your
            skills, experience and career goals.
          </p>
        </section>

        <section className="search-panel">
          <h2>🔎 Find Your Next Opportunity</h2>
          <p>Search and filter available jobs.</p>

          <div className="filters">
            <div className="field">
              <label>Job Title</label>
              <div className="input-box">
                <span>💼</span>
                <input
                  type="text"
                  placeholder="React Developer"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="field">
              <label>Company</label>
              <div className="input-box">
                <span>🏢</span>
                <input
                  type="text"
                  placeholder="Company"
                  value={company}
                  onChange={(e) =>
                    setCompany(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="field">
              <label>Location</label>
              <div className="input-box">
                <span>📍</span>
                <input
                  type="text"
                  placeholder="e.g. Pune"
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="field">
              <label>Sort By</label>
              <div className="input-box">
                <span>↕️</span>
                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value)
                  }
                >
                  <option value="newest">
                    Newest
                  </option>
                  <option value="oldest">
                    Oldest
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div className="filter-buttons">
            <button
              className="search-btn"
              onClick={searchJobs}
            >
              🔍 Search
            </button>

            <button
              className="reset-btn"
              onClick={resetFilters}
            >
              ↻ Reset
            </button>
          </div>
        </section>

        <section className="jobs-section">
          <div className="section-head">
            <div>
              <h2>💼 Available Opportunities</h2>
              <p>
                Explore jobs and take the next step
                in your career.
              </p>
            </div>

            <div className="count">
              {jobs.length} Jobs
            </div>
          </div>

          {loading ? (
            <div className="state-box">
              <div className="loader"></div>
              <h3>Loading jobs...</h3>
            </div>
          ) : jobs.length === 0 ? (
            <div className="state-box">
              <div className="empty-icon">
                🔍
              </div>

              <h2>No Jobs Found</h2>

              <p>
                Try changing your search filters.
              </p>

              <button
                className="search-btn small"
                onClick={resetFilters}
              >
                Browse All Jobs
              </button>
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map((job) => (
                <div
                  className="job-card"
                  key={job._id}
                >
                  <div className="job-head">
                    <div className="company-logo">
                      {job.company
                        ? job.company
                          .charAt(0)
                          .toUpperCase()
                        : "J"}
                    </div>

                    <div className="job-title-box">
                      <h2>{job.title}</h2>
                      <p>🏢 {job.company}</p>
                    </div>
                  </div>

                  <div className="job-details">
                    <div>
                      <small>Location</small>
                      <strong>
                        📍 {job.location}
                      </strong>
                    </div>

                    <div>
                      <small>Salary</small>
                      <strong>
                        💰 {job.salaryRange}
                      </strong>
                    </div>
                  </div>

                  <div className="description">
                    <h4>📋 Job Description</h4>
                    <p>{job.description}</p>
                  </div>

                  <div className="tag">
                    🚀 Career Opportunity
                  </div>

                  <div className="actions">
                    <button
                      className={
                        savedIds.includes(job._id)
                          ? "saved-btn"
                          : "save-btn"
                      }
                      onClick={() =>
                        saveJob(job._id)
                      }
                      disabled={savedIds.includes(
                        job._id
                      )}
                    >
                      {savedIds.includes(job._id)
                        ? "❤️ Saved"
                        : "♡ Save Job"}
                    </button>

                    <button
                      className="apply-btn"
                      onClick={() =>
                        navigate(
                          `/apply/${job._id}`
                        )
                      }
                    >
                      📄 Apply Now →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && jobs.length > 0 && (
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() =>
                  setPage(page - 1)
                }
              >
                ← Previous
              </button>

              <span>
                Page {page} of {pages}
              </span>

              <button
                disabled={page === pages}
                onClick={() =>
                  setPage(page + 1)
                }
              >
                Next →
              </button>
            </div>
          )}
        </section>
      </div>

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

        .jobs-page {
          width: 100%;
          min-height: 100vh;
          padding: 40px 24px 60px;
          background: #0f111a;
          color: white;
          font-family: "Segoe UI", Arial, sans-serif;
        }

        .hero {
          max-width: 850px;
          margin: 20px auto 40px;
          text-align: center;
        }

        .badge {
          display: inline-block;
          padding: 8px 14px;
          border-radius: 30px;
          background: rgba(59,130,246,.12);
          border: 1px solid rgba(96,165,250,.3);
          color: #93c5fd;
          font-size: 11px;
          font-weight: 700;
        }

        .hero h1 {
          margin: 18px 0 12px;
          font-size: clamp(36px, 6vw, 65px);
        }

        .hero h1 span {
          color: #8b5cf6;
        }

        .hero p {
          color: #94a3b8;
          font-size: 15px;
          line-height: 1.6;
        }

        .search-panel {
          max-width: 1200px;
          margin: 0 auto 40px;
          padding: 24px;
          border-radius: 20px;
          background: #111827;
          border: 1px solid #334155;
        }

        .search-panel h2 {
          margin: 0;
        }

        .search-panel > p {
          margin: 6px 0 20px;
          color: #94a3b8;
        }

        .filters {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .field {
          min-width: 0;
        }

        .field label {
          display: block;
          margin-bottom: 7px;
          color: #cbd5e1;
          font-size: 12px;
          font-weight: 700;
        }

        .input-box {
          height: 48px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          border-radius: 10px;
          border: 1px solid #334155;
          background: #1e293b;
        }

        .input-box input,
        .input-box select {
          width: 100%;
          min-width: 0;
          height: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: white;
        }

        .input-box input::placeholder {
          color: #64748b;
        }

        .input-box option {
          background: #1e293b;
          color: white;
        }

        .filter-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 15px;
        }

        .search-btn,
        .reset-btn {
          height: 45px;
          border: none;
          border-radius: 10px;
          color: white;
          font-weight: 700;
          cursor: pointer;
        }

        .search-btn {
          background: #2563eb;
        }

        .reset-btn {
          background: #475569;
        }

        .small {
          width: auto;
          padding: 0 18px;
          margin-top: 10px;
        }

        .jobs-section {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .section-head h2 {
          margin: 0;
          font-size: 28px;
        }

        .section-head p {
          margin: 5px 0 0;
          color: #94a3b8;
        }

        .count {
          padding: 9px 14px;
          background: #172554;
          color: #93c5fd;
          border-radius: 30px;
          font-weight: 700;
          white-space: nowrap;
        }

        .jobs-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .job-card {
          min-width: 0;
          background: white;
          color: #172033;
          padding: 22px;
          border-radius: 18px;
          border-top: 4px solid #4f46e5;
          box-shadow:
            0 10px 30px rgba(0,0,0,.18);
        }

        .job-head {
          display: flex;
          gap: 13px;
          align-items: center;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
        }

        .company-logo {
          width: 52px;
          height: 52px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: linear-gradient(
            135deg,
            #2563eb,
            #7c3aed
          );
          color: white;
          font-size: 22px;
          font-weight: 800;
        }

        .job-title-box {
          min-width: 0;
        }

        .job-title-box h2 {
          margin: 0;
          color: #172033;
          font-size: 21px;
          word-break: break-word;
        }

        .job-title-box p {
          margin: 5px 0 0;
          color: #64748b;
        }

        .job-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 15px;
        }

        .job-details > div {
          padding: 11px;
          border-radius: 10px;
          background: #f8fafc;
        }

        .job-details small {
          display: block;
          color: #94a3b8;
          margin-bottom: 3px;
        }

        .job-details strong {
          font-size: 12px;
          color: #334155;
          word-break: break-word;
        }

        .description {
          margin-top: 15px;
        }

        .description h4 {
          margin: 0 0 5px;
        }

        .description p {
          margin: 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .tag {
          display: inline-block;
          margin-top: 13px;
          padding: 6px 9px;
          border-radius: 7px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 10px;
          font-weight: 700;
        }

        .actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 17px;
        }

        .actions button {
          height: 44px;
          border-radius: 9px;
          font-weight: 700;
          cursor: pointer;
        }

        .save-btn {
          border: 1px solid #bbf7d0;
          background: #ecfdf5;
          color: #15803d;
        }

        .saved-btn {
          border: none;
          background: #dcfce7;
          color: #166534;
          cursor: not-allowed !important;
        }

        .apply-btn {
          border: none;
          background: #2563eb;
          color: white;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-top: 30px;
        }

        .pagination button {
          padding: 10px 14px;
          border: none;
          border-radius: 9px;
          background: #1e293b;
          color: white;
          cursor: pointer;
        }

        .pagination button:disabled {
          opacity: .35;
          cursor: not-allowed;
        }

        .state-box {
          text-align: center;
          padding: 55px 20px;
          border-radius: 18px;
          background: #111827;
          border: 1px solid #334155;
        }

        .empty-icon {
          font-size: 45px;
        }

        .loader {
          width: 38px;
          height: 38px;
          margin: 0 auto 15px;
          border: 4px solid #334155;
          border-top-color: #60a5fa;
          border-radius: 50%;
          animation: spin .8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 900px) {
          .filters {
            grid-template-columns: 1fr 1fr;
          }

          .jobs-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .jobs-page {
            padding: 25px 12px 40px;
          }

          .hero h1 {
            font-size: 34px;
          }

          .filters {
            grid-template-columns: 1fr;
          }

          .filter-buttons {
            grid-template-columns: 1fr;
          }

          .section-head {
            flex-direction: column;
            align-items: flex-start;
          }

          .job-details {
            grid-template-columns: 1fr;
          }

          .actions {
            grid-template-columns: 1fr;
          }

          .job-card {
            padding: 16px;
          }

          .job-title-box h2 {
            font-size: 18px;
          }

          .pagination {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 380px) {
          .jobs-page {
            padding-left: 8px;
            padding-right: 8px;
          }

          .search-panel {
            padding: 15px;
          }

          .hero h1 {
            font-size: 29px;
          }
        }

      `}</style>
    </>
  );
}

export default Jobs;