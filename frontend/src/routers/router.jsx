import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard.jsx";
import Attendance from "../pages/Attendance.jsx";
import Employee from "../pages/Employee.jsx";
import ManageUser from "../pages/ManageUser.jsx";
import PrivateRoute from "../components/Login/PrivateRoute.jsx";
import Login from "@/components/Login/Login.jsx";
import PublicRoute from "@/components/Login/PublicRoute.jsx";
import App from "@/App.jsx";
import Display from "@/pages/Display.jsx";
import MainLayout from "@/components/Layout/MainLayout.jsx";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "attendance-display",
        element: <Display />,
      },
      {
        element: <PublicRoute />,
        children: [{ path: "/login", element: <Login /> }],
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            element: <MainLayout />,
            children: [
              { index: true, element: <Dashboard /> },
              { path: "dashboard", element: <Dashboard /> },
              { path: "attendance", element: <Attendance /> },
              { path: "employee", element: <Employee /> },
              { path: "manage-user", element: <ManageUser /> },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
