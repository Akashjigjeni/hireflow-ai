import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <p style={welcomeStyle}>WELCOME BACK 👋</p>

          <h1 style={titleStyle}>Employer Dashboard</h1>

          <p style={subtitleStyle}>
            Manage your jobs, applicants and recruitment activity.
          </p>
        </div>

        <button
          style={addButtonStyle}
          onClick={() => navigate("/post-job")}
        >
          ＋ Post New Job
        </button>
      </div>

      {/* Welcome Card */}
      <div style={welcomeCardStyle}>
        <div style={avatarStyle}>
          {user?.name?.charAt(0)?.toUpperCase() || "E"}
        </div>

        <div>
          <h2 style={{ margin: 0, color: "#F5F3FF" }}>
            Welcome, {user?.name || "Employer"}!
          </h2>

          <p
            style={{
              margin: "6px 0 0",
              color: "#A9A6B8",
            }}
          >
            Here's an overview of your recruitment activity.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div style={statsGridStyle}>
        <StatCard
          icon="💼"
          number="3"
          label="Total Jobs"
          borderColor="#8B5CF6"
        />

        <StatCard
          icon="👥"
          number="3"
          label="Applicants"
          borderColor="#A855F7"
        />

        <StatCard
          icon="✅"
          number="2"
          label="Accepted"
          borderColor="#22C55E"
        />

        <StatCard
          icon="❌"
          number="1"
          label="Rejected"
          borderColor="#EF4444"
        />

        <StatCard
          icon="⏳"
          number="0"
          label="Pending"
          borderColor="#F59E0B"
        />
      </div>

      {/* Jobs Section */}
      <div style={sectionHeaderStyle}>
        <div>
          <h2 style={sectionTitleStyle}>
            Your Posted Jobs
          </h2>

          <p style={sectionSubtitleStyle}>
            Manage and monitor your active job postings.
          </p>
        </div>

        <button
          style={smallButtonStyle}
          onClick={() => navigate("/post-job")}
        >
          ＋ Add Job
        </button>
      </div>

      {/* Job Card */}
      <div style={jobCardStyle}>
        <div style={jobIconStyle}>💼</div>

        <div style={{ flex: 1 }}>
          <h3 style={jobTitleStyle}>
            Frontend Developer
          </h3>

          <p style={jobCompanyStyle}>
            🏢 HireFlow Inc
          </p>

          <div style={jobInfoStyle}>
            <span>📍 Pune, India</span>

            <span>💰 ₹5–8 LPA</span>

            <span style={activeBadgeStyle}>
              ● Active
            </span>
          </div>
        </div>

        <div style={actionContainerStyle}>
          <button
            style={editButtonStyle}
            onClick={() => navigate("/edit-job")}
          >
            ✏️ Edit
          </button>

          <button style={deleteButtonStyle}>
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}


/* ---------------- STAT CARD ---------------- */

function StatCard({
  icon,
  number,
  label,
  borderColor,
}) {
  return (
    <div
      style={{
        ...statCardStyle,
        borderTop: `4px solid ${borderColor}`,
      }}
    >
      <div
        style={{
          ...statIconStyle,
          background: `${borderColor}20`,
        }}
      >
        {icon}
      </div>

      <div>
        <h2 style={statNumberStyle}>
          {number}
        </h2>

        <p style={statLabelStyle}>
          {label}
        </p>
      </div>
    </div>
  );
}


/* ---------------- STYLES ---------------- */

const pageStyle = {
  width: "100%",
  maxWidth: "1150px",
  margin: "0 auto",
  padding: "40px 25px 70px",
  boxSizing: "border-box",
  color: "#F5F3FF",
};


/* Header */

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "30px",
};

const welcomeStyle = {
  margin: 0,
  color: "#A78BFA",
  fontSize: "13px",
  fontWeight: "700",
  letterSpacing: "1px",
};

const titleStyle = {
  margin: "6px 0",
  fontSize: "38px",
  fontWeight: "800",
  color: "#F5F3FF",
};

const subtitleStyle = {
  margin: 0,
  color: "#A9A6B8",
  fontSize: "16px",
};


/* Main Button */

const addButtonStyle = {
  border: "none",
  borderRadius: "12px",
  padding: "14px 22px",

  background:
    "linear-gradient(135deg, #8B5CF6, #A855F7)",

  color: "#FFFFFF",

  fontSize: "15px",
  fontWeight: "700",
  cursor: "pointer",

  boxShadow:
    "0 8px 20px rgba(139, 92, 246, 0.30)",
};


/* Welcome Card */

const welcomeCardStyle = {
  display: "flex",
  alignItems: "center",
  gap: "18px",

  background: "#302E36",

  border: "1px solid #46414F",

  padding: "22px",

  borderRadius: "16px",

  marginBottom: "25px",

  boxShadow:
    "0 5px 20px rgba(0,0,0,0.20)",
};

const avatarStyle = {
  width: "55px",
  height: "55px",

  borderRadius: "14px",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  background:
    "linear-gradient(135deg, #8B5CF6, #A855F7)",

  color: "#FFFFFF",

  fontSize: "22px",
  fontWeight: "800",

  boxShadow:
    "0 6px 18px rgba(139,92,246,0.25)",
};


/* Statistics */

const statsGridStyle = {
  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit, minmax(180px, 1fr))",

  gap: "18px",

  marginBottom: "45px",
};

const statCardStyle = {
  background: "#302E36",

  border: "1px solid #46414F",

  borderRadius: "14px",

  padding: "20px",

  display: "flex",
  alignItems: "center",

  gap: "15px",

  boxShadow:
    "0 5px 18px rgba(0,0,0,0.20)",
};

const statIconStyle = {
  width: "48px",
  height: "48px",

  borderRadius: "12px",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  fontSize: "22px",
};

const statNumberStyle = {
  margin: 0,

  fontSize: "28px",

  color: "#F5F3FF",

  fontWeight: "800",
};

const statLabelStyle = {
  margin: "2px 0 0",

  color: "#A9A6B8",

  fontSize: "13px",
};


/* Job Section */

const sectionHeaderStyle = {
  display: "flex",

  justifyContent: "space-between",

  alignItems: "center",

  marginBottom: "18px",
};

const sectionTitleStyle = {
  margin: 0,

  fontSize: "24px",

  color: "#F5F3FF",
};

const sectionSubtitleStyle = {
  margin: "5px 0 0",

  color: "#A9A6B8",

  fontSize: "14px",
};

const smallButtonStyle = {
  padding: "10px 16px",

  borderRadius: "9px",

  border: "1px solid #6D4BC4",

  background: "#3A2E52",

  color: "#C4B5FD",

  fontWeight: "700",

  cursor: "pointer",
};


/* Job Card */

const jobCardStyle = {
  display: "flex",

  alignItems: "center",

  gap: "18px",

  background: "#302E36",

  border: "1px solid #46414F",

  padding: "22px",

  borderRadius: "16px",

  boxShadow:
    "0 5px 20px rgba(0,0,0,0.20)",
};

const jobIconStyle = {
  width: "55px",
  height: "55px",

  borderRadius: "14px",

  background: "#3A2E52",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  fontSize: "24px",
};

const jobTitleStyle = {
  margin: 0,

  fontSize: "18px",

  color: "#F5F3FF",
};

const jobCompanyStyle = {
  margin: "6px 0",

  color: "#A9A6B8",
};

const jobInfoStyle = {
  display: "flex",

  gap: "18px",

  flexWrap: "wrap",

  color: "#A9A6B8",

  fontSize: "13px",
};

const activeBadgeStyle = {
  color: "#4ADE80",

  fontWeight: "700",
};


/* Action Buttons */

const actionContainerStyle = {
  display: "flex",

  gap: "10px",
};

const editButtonStyle = {
  padding: "9px 14px",

  borderRadius: "8px",

  border: "1px solid #6D4BC4",

  background: "#3A2E52",

  color: "#C4B5FD",

  cursor: "pointer",

  fontWeight: "600",
};

const deleteButtonStyle = {
  padding: "9px 14px",

  borderRadius: "8px",

  border: "1px solid #7F3A46",

  background: "#3A252C",

  color: "#FCA5A5",

  cursor: "pointer",

  fontWeight: "600",
};

export default Dashboard;