import { type ReactElement, lazy, useEffect, useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./PrivateRoute";
import { SocketProvider } from "../socket/socket";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken } from "../api/auth.api";
import { setUser, unsetUser } from "../redux/reducers/auth.reducer";
import AppLayoutLoader from "../components/loader/skeliton";

const Home = lazy(() => import("../pages/Home"));
const Chat = lazy(() => import("../pages/Chat"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const NotFound = lazy(() => import("../pages/NotFound"));

const AppRoutes = () => {
  const [loading, setLoading] = useState(true);

  const user = useSelector((state: any) => state.auth.user);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await verifyToken();
        dispatch(setUser(data.user));
      } catch (err) {
        dispatch(unsetUser());
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <AppLayoutLoader />;

  const routes = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute user={user}>
          <SocketProvider>
            <Outlet />
          </SocketProvider>
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "chat/:id",
          element: <Chat />,
        },
      ],
    },
    {
      path: "/login",
      element: (
        <ProtectedRoute user={!user} redirect="/">
          <Login />{" "}
        </ProtectedRoute>
      ),
    },
    {
      path: "/signup",
      element: (
        <ProtectedRoute user={!user} redirect="/login">
          <Signup />{" "}
        </ProtectedRoute>
      ),
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
  return <RouterProvider router={routes} />;
};

export default AppRoutes;
