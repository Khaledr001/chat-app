import { type ReactElement } from "react";
import { ChatLayout } from "../pages/ChatLayout";
import { Login } from "../pages/Login";
import { Signup } from "../pages/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";

const privateRouteWrapper = (elemtnt: ReactElement): ReactElement => {
  return <PrivateRoute> {elemtnt} </PrivateRoute>;
};

const AppRoute = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: privateRouteWrapper(<ChatLayout />),
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
  ]);
  return <RouterProvider router={routes} />;
};

export default AppRoute;
