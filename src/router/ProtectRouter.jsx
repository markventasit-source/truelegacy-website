import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Check both localStorage and sessionStorage for succession data
  const localStoredData = localStorage.getItem("successionData");
  const sessionStoredData = sessionStorage.getItem("successionData");
  
  // Prioritize localStorage, fallback to sessionStorage
  const storedData = localStoredData || sessionStoredData;
  const successionData = storedData ? JSON.parse(storedData) : null;
  const token = successionData?.temporary_user?.token;
  
  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

export default ProtectedRoute;
