import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({
  children,
  allowedRoles,
}) {
  const location = useLocation();

  const token = localStorage.getItem("token");

  const userData = localStorage.getItem("user");

  let user = null;

  try {
    user = userData
      ? JSON.parse(userData)
      : null;
  } catch (error) {
    console.error(
      "Invalid user data in localStorage"
    );
  }


  /* =========================
     NOT LOGGED IN
  ========================= */

  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }


  /* =========================
     ROLE CHECK
  ========================= */

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    if (user.role === "candidate") {
      return (
        <Navigate
          to="/candidate-dashboard"
          replace
        />
      );
    }

    if (user.role === "employer") {
      return (
        <Navigate
          to="/employer-dashboard"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }


  /* =========================
     AUTHORIZED
  ========================= */

  return children;
}

export default ProtectedRoute;