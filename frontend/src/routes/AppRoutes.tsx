import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Urls from "../pages/Urls/Urls";
import Analytics from "../pages/Analytics/Analytics";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Settings/Settings";
import NotFound from "../pages/NotFound/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { ROUTES } from "../constants/routes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing page */}
      <Route path={ROUTES.HOME} element={<Home />} />

      {/* Guest/Public-only routes */}
      <Route element={<PublicRoute />}>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
      </Route>

      {/* Authenticated routes */}
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.URLS} element={<Urls />} />
        <Route path={ROUTES.ANALYTICS} element={<Analytics />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={ROUTES.SETTINGS} element={<Settings />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
