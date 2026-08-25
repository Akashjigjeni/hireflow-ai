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

      const data = res.data;
      if (Array.isArray(data)) {
        setJobs(data);
        setPages(1);
      } else {
        setJobs(data?.jobs || []);
        setPages(data?.pages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page]);

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

      const data = res.data;
      if (Array.isArray(data)) {
        setJobs(data);
        setPages(1);
      } else {
        setJobs(data?.jobs || []);
        setPages(data?.pages || 1);
      }
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

      const data = res.data;
      if (Array.isArray(data)) {
        setJobs(data);
        setPages(1);
      } else {
        setJobs(data?.jobs || []);
        setPages(data?.pages || 1);
      }
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

  const getCompanyInitial = (companyName) => {
    if (!companyName) return "J";

    return companyName
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  return (
    <>
      <Navbar />

      <div className="jobs-page">

        {/* HERO */}

        <section className="jobs-hero">

          <div className="hero-pill">
            ✨ AI-POWERED JOB DISCOVERY
          </div>

          <h1>
            Find the right
            <span> opportunity.</span>
          </h1>

          <p>
            Discover jobs that match your skills,
            goals and career ambitions.
          </p>

          <div className="hero-stats">

            <div>
              <strong>{jobs.length}</strong>
              <span>Visible Jobs</span>
            </div>

            <div className="hero-divider"></div>

            <div>
              <strong>AI</strong>
              <span>Smart Matching</span>
            </div>

            <div className="hero-divider"></div>

            <div>
              <strong>24/7</strong>
              <span>Opportunities</span>
            </div>

          </div>

        </section>


        {/* SEARCH PANEL */}

        <section className="search-card">

          <div className="search-header">

            <div>
              <div className="section-label">
                DISCOVER
              </div>

              <h2>
                Find Your Next Opportunity
              </h2>

              <p>
                Search by role, company or location
                and refine your results.
              </p>
            </div>

            <div className="search-icon">
              🔍
            </div>

          </div>


          <div className="filters-grid">

            <div className="filter-group">

              <label>Job Title</label>

              <div className="input-box">

                <span className="input-icon">
                  💼
                </span>

                <input
                  type="text"
                  placeholder="e.g. React Developer"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

            </div>


            <div className="filter-group">

              <label>Company</label>

              <div className="input-box">

                <span className="input-icon">
                  🏢
                </span>

                <input
                  type="text"
                  placeholder="e.g. ABC Tech"
                  value={company}
                  onChange={(e) =>
                    setCompany(e.target.value)
                  }
                />

              </div>

            </div>


            <div className="filter-group">

              <label>Location</label>

              <div className="input-box">

                <span className="input-icon">
                  📍
                </span>

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


            <div className="filter-group">

              <label>Sort By</label>

              <div className="input-box">

                <span className="input-icon">
                  ↕️
                </span>

                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value)
                  }
                >
                  <option value="newest">
                    Newest First
                  </option>

                  <option value="oldest">
                    Oldest First
                  </option>
                </select>

              </div>

            </div>

          </div>


          <div className="search-actions">

            <button
              className="primary-search-btn"
              onClick={searchJobs}
            >
              <span>🔍</span>
              Search Jobs
            </button>

            <button
              className="secondary-search-btn"
              onClick={resetFilters}
            >
              ↻ Reset Filters
            </button>

          </div>

        </section>


        {/* JOB SECTION */}

        <section className="jobs-section">

          <div className="jobs-section-header">

            <div>

              <div className="section-label">
                OPEN POSITIONS
              </div>

              <h2>
                Available Opportunities
              </h2>

              <p>
                Explore roles and take your next
                career step.
              </p>

            </div>

            <div className="jobs-count">

              <strong>
                {jobs.length}
              </strong>

              <span>
                {jobs.length === 1
                  ? "Job"
                  : "Jobs"}
              </span>

            </div>

          </div>


          {/* LOADING */}

          {loading ? (

            <div className="state-card">

              <div className="loader"></div>

              <h3>
                Finding opportunities...
              </h3>

              <p>
                Please wait while we load the
                latest jobs.
              </p>

            </div>

          ) : jobs.length === 0 ? (

            <div className="state-card">

              <div className="empty-illustration">
                🔎
              </div>

              <h2>
                No Jobs Found
              </h2>

              <p>
                Try changing your search filters
                or browse all available jobs.
              </p>

              <button
                className="primary-search-btn browse-btn"
                onClick={resetFilters}
              >
                Browse All Jobs
              </button>

            </div>

          ) : (

            <div className="jobs-grid">

              {jobs.map((job) => (

                <article
                  className="job-card"
                  key={job._id}
                >

                  <div className="job-card-top">

                    <div className="company-logo">
                      {getCompanyInitial(job.company)}
                    </div>

                    <div className="job-heading">

                      <div className="job-status">
                        <span></span>
                        OPEN POSITION
                      </div>

                      <h3>
                        {job.title}
                      </h3>

                      <p>
                        🏢 {job.company}
                      </p>

                    </div>

                  </div>


                  <div className="job-meta">

                    <div className="meta-card">

                      <span className="meta-icon">
                        📍
                      </span>

                      <div>

                        <small>
                          LOCATION
                        </small>

                        <strong>
                          {job.location}
                        </strong>

                      </div>

                    </div>


                    <div className="meta-card">

                      <span className="meta-icon">
                        💰
                      </span>

                      <div>

                        <small>
                          SALARY
                        </small>

                        <strong>
                          {job.salaryRange}
                        </strong>

                      </div>

                    </div>

                  </div>


                  <div className="job-description">

                    <div className="description-title">

                      <span>📋</span>

                      <strong>
                        Job Description
                      </strong>

                    </div>

                    <p>
                      {job.description}
                    </p>

                  </div>


                  <div className="job-tags">

                    <span>
                      🚀 Career Opportunity
                    </span>

                    <span>
                      ✨ AI Platform
                    </span>

                  </div>


                  <div className="job-actions">

                    <button
                      className={
                        savedIds.includes(job._id)
                          ? "saved-button"
                          : "save-button"
                      }
                      onClick={() =>
                        saveJob(job._id)
                      }
                      disabled={savedIds.includes(job._id)}
                    >
                      {savedIds.includes(job._id)
                        ? "❤️ Saved"
                        : "♡ Save Job"}
                    </button>


                    <button
                      className="apply-button"
                      onClick={() =>
                        navigate(`/apply/${job._id}`)
                      }
                    >
                      Apply Now
                      <span>→</span>
                    </button>

                  </div>

                </article>

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

              <div className="page-indicator">

                <span>Page</span>

                <strong>
                  {page}
                </strong>

                <span>
                  of {pages}
                </span>

              </div>

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


      {/* STYLES */}

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

        .jobs-page {
          width: 100%;
          min-height: 100vh;

          padding: 45px 24px 70px;

          color: #F5F3FF;

          background:
            radial-gradient(
              circle at 10% 10%,
              rgba(139, 92, 246, .14),
              transparent 28%
            ),
            radial-gradient(
              circle at 90% 35%,
              rgba(168, 85, 247, .10),
              transparent 30%
            ),
            #24232A;

          overflow-x: hidden;
        }


        /* HERO */

        .jobs-hero {
          max-width: 950px;
          margin: 10px auto 45px;
          text-align: center;
        }

        .hero-pill {
          display: inline-flex;
          align-items: center;

          padding: 8px 15px;

          border-radius: 999px;

          background: rgba(139, 92, 246, .12);

          border: 1px solid
            rgba(167, 139, 250, .32);

          color: #C4B5FD;

          font-size: 11px;
          font-weight: 800;

          letter-spacing: .9px;
        }

        .jobs-hero h1 {
          margin: 20px 0 12px;

          font-size:
            clamp(42px, 6vw, 72px);

          line-height: 1.02;

          letter-spacing: -2px;

          color: #F5F3FF;

          font-weight: 850;
        }

        .jobs-hero h1 span {
          background:
            linear-gradient(
              90deg,
              #A78BFA,
              #D8B4FE
            );

          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .jobs-hero > p {
          max-width: 700px;

          margin: 0 auto;

          color: #A9A6B8;

          font-size: 16px;

          line-height: 1.7;
        }


        /* HERO STATS */

        .hero-stats {
          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 28px;

          margin-top: 28px;

          padding: 13px 18px;

          border-radius: 14px;

          background: #302E36;

          border: 1px solid #46414F;

          box-shadow:
            0 12px 35px
            rgba(0,0,0,.22);
        }

        .hero-stats div:not(.hero-divider) {
          display: flex;

          flex-direction: column;

          align-items: center;

          gap: 2px;

          min-width: 75px;
        }

        .hero-stats strong {
          color: #F5F3FF;
          font-size: 17px;
        }

        .hero-stats span {
          color: #A9A6B8;

          font-size: 9px;

          font-weight: 700;

          text-transform: uppercase;

          letter-spacing: .4px;
        }

        .hero-divider {
          width: 1px;
          height: 28px;

          background: #46414F;
        }


        /* SEARCH CARD */

        .search-card {
          width: 100%;
          max-width: 1200px;

          margin:
            0 auto 48px;

          padding: 26px;

          border-radius: 22px;

          background: #302E36;

          border: 1px solid #46414F;

          box-shadow:
            0 25px 60px
            rgba(0,0,0,.25);
        }

        .search-header {
          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 18px;

          margin-bottom: 25px;
        }

        .section-label {
          margin-bottom: 6px;

          color: #A78BFA;

          font-size: 9px;

          font-weight: 900;

          letter-spacing: 1.4px;
        }

        .search-header h2 {
          margin: 0;

          color: #F5F3FF;

          font-size: 22px;
        }

        .search-header p {
          margin:
            6px 0 0;

          color: #A9A6B8;

          font-size: 12px;
        }

        .search-icon {
          width: 44px;
          height: 44px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 12px;

          background: #3A2E52;

          border: 1px solid #6D4BC4;

          font-size: 19px;
        }


        /* FILTERS */

        .filters-grid {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0,1fr));

          gap: 14px;
        }

        .filter-group {
          min-width: 0;
        }

        .filter-group label {
          display: block;

          margin-bottom: 7px;

          color: #D6D3E1;

          font-size: 10px;

          font-weight: 800;

          text-transform: uppercase;

          letter-spacing: .6px;
        }

        .input-box {
          width: 100%;
          min-width: 0;

          height: 50px;

          display: flex;

          align-items: center;

          gap: 8px;

          padding:
            0 12px;

          border-radius: 11px;

          background: #24232A;

          border: 1px solid #46414F;

          transition:
            .2s ease;
        }

        .input-box:focus-within {
          border-color: #8B5CF6;

          box-shadow:
            0 0 0 3px
            rgba(139, 92, 246, .15);
        }

        .input-icon {
          flex-shrink: 0;
          font-size: 14px;
        }

        .input-box input,
        .input-box select {
          width: 100%;
          min-width: 0;

          height: 100%;

          border: none;

          outline: none;

          background: transparent;

          color: #F5F3FF;

          font-size: 12px;
        }

        .input-box input::placeholder {
          color: #777383;
        }

        .input-box select option {
          background: #302E36;
          color: #F5F3FF;
        }


        /* SEARCH BUTTONS */

        .search-actions {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 12px;

          margin-top: 18px;
        }

        .primary-search-btn,
        .secondary-search-btn {
          height: 47px;

          border: none;

          border-radius: 11px;

          font-size: 12px;

          font-weight: 800;

          cursor: pointer;

          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .primary-search-btn {
          background:
            linear-gradient(
              135deg,
              #8B5CF6,
              #A855F7
            );

          color: white;

          box-shadow:
            0 10px 24px
            rgba(139, 92, 246, .25);
        }

        .secondary-search-btn {
          background: #24232A;

          color: #C4B5FD;

          border:
            1px solid #6D4BC4;
        }

        .primary-search-btn:hover,
        .secondary-search-btn:hover {
          transform:
            translateY(-2px);
        }


        /* JOB SECTION */

        .jobs-section {
          max-width: 1200px;

          margin: 0 auto;

          min-width: 0;
        }

        .jobs-section-header {
          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 18px;

          margin-bottom: 20px;
        }

        .jobs-section-header h2 {
          margin: 0;

          color: #F5F3FF;

          font-size: 28px;

          letter-spacing: -.5px;
        }

        .jobs-section-header p {
          margin:
            5px 0 0;

          color: #A9A6B8;

          font-size: 12px;
        }

        .jobs-count {
          display: flex;

          align-items: center;

          gap: 7px;

          padding:
            10px 15px;

          border-radius: 999px;

          background: #3A2E52;

          border:
            1px solid #6D4BC4;

          color: #C4B5FD;

          white-space: nowrap;
        }

        .jobs-count strong {
          font-size: 17px;
        }

        .jobs-count span {
          font-size: 10px;

          font-weight: 700;

          text-transform: uppercase;

          letter-spacing: .5px;
        }


        /* GRID */

        .jobs-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0,1fr));

          gap: 20px;
        }


        /* JOB CARD */

        .job-card {
          position: relative;

          min-width: 0;

          padding: 22px;

          border-radius: 19px;

          background: #302E36;

          color: #F5F3FF;

          border:
            1px solid #46414F;

          box-shadow:
            0 15px 35px
            rgba(0,0,0,.18);

          overflow: hidden;

          transition:
            transform .25s ease,
            box-shadow .25s ease,
            background .25s ease;
        }

        .job-card::before {
          content: "";

          position: absolute;

          top: 0;
          left: 0;
          right: 0;

          height: 4px;

          background:
            linear-gradient(
              90deg,
              #8B5CF6,
              #A855F7
            );
        }

        .job-card:hover {
          transform:
            translateY(-4px);

          background: #383540;

          box-shadow:
            0 22px 45px
            rgba(0,0,0,.28);
        }


        /* CARD TOP */

        .job-card-top {
          display: flex;

          align-items: center;

          gap: 13px;

          min-width: 0;

          padding-bottom: 17px;

          border-bottom:
            1px solid #46414F;
        }

        .company-logo {
          width: 54px;
          height: 54px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 14px;

          background:
            linear-gradient(
              135deg,
              #8B5CF6,
              #A855F7
            );

          color: white;

          font-size: 22px;

          font-weight: 900;

          box-shadow:
            0 8px 18px
            rgba(139,92,246,.25);
        }

        .job-heading {
          min-width: 0;
        }

        .job-status {
          display: flex;

          align-items: center;

          gap: 5px;

          margin-bottom: 4px;

          color: #4ADE80;

          font-size: 8px;

          font-weight: 900;

          letter-spacing: .8px;
        }

        .job-status span {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #22C55E;
        }

        .job-heading h3 {
          margin: 0;

          color: #F5F3FF;

          font-size: 21px;

          line-height: 1.25;

          word-break: break-word;
        }

        .job-heading p {
          margin:
            5px 0 0;

          color: #A9A6B8;

          font-size: 12px;

          font-weight: 600;

          word-break: break-word;
        }


        /* META */

        .job-meta {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0,1fr));

          gap: 10px;

          margin-top: 16px;
        }

        .meta-card {
          display: flex;

          align-items: center;

          gap: 9px;

          min-width: 0;

          padding: 11px;

          border-radius: 11px;

          background: #24232A;

          border:
            1px solid #46414F;
        }

        .meta-icon {
          flex-shrink: 0;
          font-size: 17px;
        }

        .meta-card small {
          display: block;

          margin-bottom: 3px;

          color: #777383;

          font-size: 8px;

          font-weight: 800;

          letter-spacing: .5px;
        }

        .meta-card strong {
          display: block;

          color: #F5F3FF;

          font-size: 11px;

          word-break: break-word;
        }


        /* DESCRIPTION */

        .job-description {
          margin-top: 17px;
        }

        .description-title {
          display: flex;

          align-items: center;

          gap: 7px;

          margin-bottom: 6px;

          color: #D6D3E1;

          font-size: 12px;
        }

        .job-description p {
          margin: 0;

          color: #A9A6B8;

          font-size: 12px;

          line-height: 1.6;

          display: -webkit-box;

          -webkit-box-orient: vertical;

          -webkit-line-clamp: 3;

          overflow: hidden;
        }


        /* TAGS */

        .job-tags {
          display: flex;

          flex-wrap: wrap;

          gap: 7px;

          margin-top: 14px;
        }

        .job-tags span {
          padding:
            6px 9px;

          border-radius: 7px;

          background: #3A2E52;

          border: 1px solid #6D4BC4;

          color: #C4B5FD;

          font-size: 9px;

          font-weight: 800;
        }


        /* ACTIONS */

        .job-actions {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 10px;

          margin-top: 18px;
        }

        .job-actions button {
          height: 45px;

          border-radius: 10px;

          font-size: 12px;

          font-weight: 800;

          cursor: pointer;

          transition:
            transform .2s ease;
        }

        .job-actions button:hover {
          transform:
            translateY(-2px);
        }

        .save-button {
          border:
            1px solid #4F8B68;

          background:
            rgba(34, 197, 94, .10);

          color: #86EFAC;
        }

        .saved-button {
          border:
            1px solid #4F8B68;

          background:
            rgba(34, 197, 94, .18);

          color: #86EFAC;

          cursor:
            not-allowed !important;
        }

        .apply-button {
          display: flex;

          align-items: center;

          justify-content: center;

          gap: 8px;

          border: none;

          background:
            linear-gradient(
              135deg,
              #8B5CF6,
              #A855F7
            );

          color: white;

          box-shadow:
            0 8px 18px
            rgba(139,92,246,.25);
        }

        .apply-button span {
          font-size: 15px;
        }


        /* STATES */

        .state-card {
          width: 100%;

          padding:
            60px 20px;

          text-align: center;

          border-radius: 18px;

          background: #302E36;

          border:
            1px solid #46414F;
        }

        .state-card h2,
        .state-card h3 {
          margin:
            12px 0 5px;

          color: #F5F3FF;
        }

        .state-card p {
          margin: 0 auto;

          max-width: 450px;

          color: #A9A6B8;

          font-size: 12px;

          line-height: 1.6;
        }

        .empty-illustration {
          font-size: 45px;
        }

        .browse-btn {
          width: auto;

          padding:
            0 18px;

          margin-top: 15px;
        }


        /* LOADER */

        .loader {
          width: 40px;
          height: 40px;

          margin:
            0 auto;

          border:
            4px solid
            rgba(167, 139, 250, .18);

          border-top-color:
            #A78BFA;

          border-radius: 50%;

          animation:
            spin .8s linear infinite;
        }

        @keyframes spin {
          to {
            transform:
              rotate(360deg);
          }
        }


        /* PAGINATION */

        .pagination {
          display: flex;

          align-items: center;

          justify-content: center;

          gap: 12px;

          margin-top: 30px;
        }

        .pagination button {
          min-width: 105px;

          height: 40px;

          padding:
            0 13px;

          border:
            1px solid #46414F;

          border-radius: 9px;

          background:
            #302E36;

          color: #F5F3FF;

          font-size: 11px;

          font-weight: 700;

          cursor: pointer;
        }

        .pagination button:hover:not(:disabled) {
          border-color: #8B5CF6;

          background: #3A2E52;
        }

        .pagination button:disabled {
          opacity: .35;

          cursor:
            not-allowed;
        }

        .page-indicator {
          display: flex;

          align-items: center;

          gap: 6px;

          color: #A9A6B8;

          font-size: 11px;
        }

        .page-indicator strong {
          display: flex;

          align-items: center;

          justify-content: center;

          width: 32px;
          height: 32px;

          border-radius: 8px;

          background:
            linear-gradient(
              135deg,
              #8B5CF6,
              #A855F7
            );

          color: white;
        }


        /* TABLET */

        @media (max-width: 950px) {

          .filters-grid {
            grid-template-columns:
              repeat(2, minmax(0,1fr));
          }

          .jobs-grid {
            grid-template-columns: 1fr;
          }

        }


        /* MOBILE */

        @media (max-width: 600px) {

          .jobs-page {
            padding:
              26px 12px 45px;
          }

          .jobs-hero {
            margin:
              5px auto 28px;
          }

          .hero-pill {
            font-size: 8px;

            padding:
              7px 10px;
          }

          .jobs-hero h1 {
            font-size: 34px;

            letter-spacing:
              -1px;
          }

          .jobs-hero > p {
            font-size: 12px;
          }

          .hero-stats {
            width: 100%;

            gap: 10px;

            padding:
              10px 8px;
          }

          .hero-stats div:not(.hero-divider) {
            min-width: 0;

            flex: 1;
          }

          .hero-stats strong {
            font-size: 14px;
          }

          .hero-stats span {
            font-size: 7px;

            text-align: center;
          }

          .hero-divider {
            height: 25px;
          }


          .search-card {
            padding: 18px;

            border-radius: 17px;

            margin-bottom: 35px;
          }

          .search-header {
            align-items: flex-start;
          }

          .search-header h2 {
            font-size: 18px;
          }

          .search-header p {
            font-size: 10px;
          }

          .search-icon {
            width: 38px;
            height: 38px;

            font-size: 16px;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }

          .search-actions {
            grid-template-columns: 1fr;
          }


          .jobs-section-header {
            flex-direction: column;

            align-items: flex-start;
          }

          .jobs-section-header h2 {
            font-size: 22px;
          }

          .jobs-count {
            align-self:
              flex-start;
          }


          .jobs-grid {
            grid-template-columns: 1fr;
          }


          .job-card {
            padding: 17px;
          }

          .company-logo {
            width: 47px;
            height: 47px;

            font-size: 18px;
          }

          .job-heading h3 {
            font-size: 18px;
          }

          .job-heading p {
            font-size: 10px;
          }


          .job-meta {
            grid-template-columns: 1fr;
          }


          .job-actions {
            grid-template-columns: 1fr;
          }

          .job-actions button {
            height: 46px;
          }


          .pagination {
            flex-wrap: wrap;

            gap: 8px;
          }

          .pagination button {
            min-width: 100px;
          }

        }


        /* VERY SMALL PHONE */

        @media (max-width: 380px) {

          .jobs-page {
            padding-left: 8px;
            padding-right: 8px;
          }

          .search-card {
            padding: 15px;
          }

          .jobs-hero h1 {
            font-size: 29px;
          }

          .hero-stats {
            gap: 5px;
          }

          .hero-stats span {
            font-size: 6px;
          }

          .job-card {
            padding: 14px;
          }

        }

      `}</style>

    </>
  );
}

export default Jobs;