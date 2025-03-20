import React from "react";
import Dashboard from "./pages/Dashboard";
import { createBrowserRouter as Router, RouterProvider, Outlet } from "react-router-dom";



const App = () => {
  const router = Router([
    {
      path: "/",
      element: <Dashboard />,
    },
  ]);

  return (
    <div className="App w-full h-full min-h-screen bg-background">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
