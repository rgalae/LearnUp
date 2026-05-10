import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);

    const role = decoded.role;

    // Student trying to access teacher routes
    if (location.pathname.startsWith("/teacher") && role !== "teacher") {
      return <Navigate to="/student" />;
    }

    // Teacher trying to access student routes
    if (location.pathname.startsWith("/student") && role === "teacher") {
      return <Navigate to="/teacher" />;
    }

    return children;
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;
