import React from "react";
import { Link, NavLink } from "react-router";

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarGroupLabel,
  SidebarMenuAction,
} from "@/components/ui/sidebar";

import { navbarLinks } from "../../Constant";

import logo from "../../assets/Logo/Logo.png";
import logoIcon from "../../assets/Logo/Logo Icon.png";
import { cn } from "@/lib/utils";

const SidebarLogo = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Link to="/" className="flex h-16 w-full items-left">
      <img
        src={collapsed ? logoIcon : logo}
        alt="Logo"
        className={`object-contain transition-all duration-300 ${
          collapsed ? "h-10 w-10" : "h-12 max-w-[160px]"
        }`}
      />
    </Link>
  );
};

const Sidebar = () => {
  return (
    <ShadcnSidebar
      variant="floating"
      collapsible="icon"
      className="border-none bg-background">
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent className="px-2 py-6">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="font-DMsans">
            Attendance
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navbarLinks.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.label}
                    isActive={false}>
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      className={cn("font-DMsans text-base", ({ isActive }) =>
                        isActive ? "active" : "",
                      )}>
                      <item.icon className="shrink-0 size-20" />
                      <span className="text-base font-DMsans font-medium">
                        {item.label}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                  <SidebarMenuAction className="peer-data-[active=true]/menu-button:opacity-100" />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </ShadcnSidebar>
  );
};

export default Sidebar;
