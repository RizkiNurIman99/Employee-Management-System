import { useEffect, useRef, useState } from "react";
import { ArrowLeftToLine, LogOut, UserCircle2Icon } from "lucide-react";
import { LuBell, LuMoon, LuSun } from "react-icons/lu";
import { useTheme } from "../Hook/use-theme";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = ({ collapsed, setCollapsed }) => {
  const { theme, setTheme } = useTheme();
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const dropDownRef = useRef(null);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    logout();
    setIsDropDownOpen(false);
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setIsDropDownOpen(false);
      }
    };
    if (isDropDownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropDownOpen]);

  return (
    <header className="relative z-10 flex h-[80px] items-center justify-between px-4 bg-light dark:bg-dark border-b border-b-slate-300 dark:border-b-second_dark">
      <div className="flex items-center gap-x-3">
        <button onClick={() => setCollapsed(!collapsed)}>
          <ArrowLeftToLine
            className={`size-5 transition-transform duration-300  cursor-pointer ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
      <div className="flex items-center gap-x-3">
        <button
          className="btn-ghost size-10 cursor-pointer"
          onClick={toggleTheme}>
          {theme === "light" ? <LuMoon size={20} /> : <LuSun size={20} />}
        </button>
        <button className="btn-ghost size-10">
          <LuBell size={20} />
        </button>
        <button
          className="size-10 relative rounded-full"
          onClick={() => setIsDropDownOpen(!isDropDownOpen)}>
          <UserCircle2Icon />
        </button>
        {isDropDownOpen && (
          <div className="absolute right-5 top-full mt-2 w-48 rounded-sm bg-white dark:bg-second_dark shadow-xl ring-1 ring-black/10">
            <div className="py-1">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-surface_dark">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
