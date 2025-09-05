import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  user,
  redirect = "/login",
}: {
  children?: React.ReactNode;
  user: any;
  redirect?: string;
}) => {
  if (!user) {
    return <Navigate to={redirect} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
