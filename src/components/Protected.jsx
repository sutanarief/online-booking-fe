import { Navigate } from "react-router-dom";

const Protected = ({ children }) => {
  if (!localStorage.getItem('token') && !window.location.pathname.includes('login')) {
    return <Navigate to="/login" replace />;
  }
  if (localStorage.getItem('token') && window.location.pathname.includes('login')) {
    return <Navigate to="/" replace />
  }
  return children;
};
export default Protected;