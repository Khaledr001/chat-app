import { type ReactElement, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";

const AppLayout = lazy(() => import("../pages/AppLayout"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const NotFound = lazy(() => import("../pages/NotFound"));

const privateRouteWrapper = (elemtnt: ReactElement): ReactElement => {
  return <PrivateRoute> {elemtnt} </PrivateRoute>;
};

const AppRoutes = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: privateRouteWrapper(<AppLayout />),
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
  return <RouterProvider router={routes} />;
};

export default AppRoutes;
