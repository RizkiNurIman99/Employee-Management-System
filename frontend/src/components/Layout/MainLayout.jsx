import React, { useState } from "react";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import Sidebar from "./Sidebar";
import { Outlet } from "react-router";
import TopBar from "./TopBar";

const DashboardLayout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <SidebarInset className="min-w-0">
          {/* Header */}
          <header className="flex h-16 items-center gap-3 border-b border-border px-4">
            <SidebarTrigger />
            <TopBar />
          </header>
          {/* Main Content */}
          <main className="min-w-0 flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
