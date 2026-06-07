import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
  isAllowed?: boolean;
};

const ProtectedRoute = ({ isAllowed = false }: ProtectedRouteProps) => {
  return isAllowed ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
