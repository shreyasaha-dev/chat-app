import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export const PublicRoute = ({ children }) => {
  const meData = useSelector((state) => state.meData);
  if (meData?.accessToken) {
    return <Navigate to="/" replace />;
  }
  return children ? children : <Outlet />;
};

export const PrivateRoute = ({ children }) => {
  const meData = useSelector((state) => state.meData);
  console.log(meData);
  if (!meData?.accessToken) {
    return <Navigate to="/login" replace />;
  }
  return children ? children : <Outlet />;
};
