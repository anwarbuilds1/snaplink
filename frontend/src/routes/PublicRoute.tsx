import { Navigate, Outlet } from "react-router-dom";

type PublicRouteProps = {
  isAuthenticated?: boolean;
};

const PublicRoute = ({ isAuthenticated = false }: PublicRouteProps) => {
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;
