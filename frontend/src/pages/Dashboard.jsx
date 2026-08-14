function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
        color: "white",
      }}
    >
      <h1>Employer Dashboard</h1>

      <h3>Welcome, {user?.name} 👋</h3>

      <button
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          cursor: "pointer",
        }}
      >
        + Add New Job
      </button>

      <hr style={{ margin: "30px 0" }} />

      <h2>Your Posted Jobs</h2>

      <div
        style={{
          border: "1px solid gray",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px",
        }}
      >
        <h3>Frontend Developer</h3>

        <p>HireFlow Inc</p>

        <button>Edit</button>

        <button style={{ marginLeft: "10px" }}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default Dashboard;