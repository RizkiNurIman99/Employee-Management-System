import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import Sidebar from "../Sidebar/Sidebar.jsx";
import Header from "../Header/Header.jsx";
import { Outlet } from "react-router";

const DashboardLayout = () => {
  const isDesktopDevice = useMediaQuery("(min-width:768px)");
  const [collapsed, setCollapsed] = useState(!isDesktopDevice);

  const sidebarRef = useRef(null);

  useEffect(() => {
    setCollapsed(!isDesktopDevice);
  }, [isDesktopDevice]);

  return (
    <div className="flex h-screen">
      <Sidebar ref={sidebarRef} collapsed={collapsed} />
      <div className="transition duration-300 flex flex-col flex-1 overflow-hidden">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="flex-1 p-4 md:p-6 bg-accent dark:bg-secondary overflow-y-auto  ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
