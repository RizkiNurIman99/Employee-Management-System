import React, { forwardRef } from "react";
import { Link, NavLink } from "react-router";
import { navbarLinks } from "../Constant";

import logolight from "../../assets/Logo/1x/logolightmode.png";
import logodark from "../../assets/Logo/1x/logodarkmode.png";
import logoicon from "../../assets/Logo/1x/logo.png";
import { useTheme } from "../Context/theme-context";

const Sidebar = forwardRef(({ collapsed }, ref) => {
  const { theme } = useTheme();
  const logosrc = collapsed
    ? logoicon
    : theme === "dark"
    ? logodark
    : logolight;
  return (
    <aside
      ref={ref}
      className={`${
        collapsed ? "w-[70px]" : "w-[200px]"
      } h-screen bg-background border-r border-r-border`}>
      <div className="h-[60px] px-4 flex items-center font-semibold dark:text-light">
        <Link to={"/"}>
          <img
            src={logosrc}
            className={`object-contain transition-all duration-300
    ${collapsed ? "h-[40px]" : "h-[50px]"}
    max-w-full dark:brightness-110
  `}
          />
        </Link>
      </div>
      <div className="flex flex-col py-12">
        {navbarLinks.map((navbarLink) => (
          <nav key={navbarLink.id} className="sidebar-group">
            <NavLink
              to={navbarLink.path}
              className={`sidebar-items transition-all duration-300 ${
                collapsed ? "p-4" : ""
              }`}>
              <navbarLink.icon size={20} className="flex-shrink-0" />
              <span
                className={`inline-block whitespace-nowrap transition-all duration-50 ${
                  collapsed
                    ? "opacity-0 translate-x-[-10px]"
                    : "opacity-100 translate-x-0"
                }`}>
                {navbarLink.label}
              </span>
            </NavLink>
          </nav>
        ))}
      </div>
    </aside>
  );
});

export default Sidebar;
