import React, { useState } from "react";

import {
  LayoutDashboard,
  FileText,
  Bot,
  BarChart3,
  Settings,
  CircleHelp,
  CreditCard,
  Menu,
  X,
  Search,
  LogOut,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const DashboardLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const displayName = user?.name || user?.email || "Account";
  const initial = (user?.name || user?.email || "?").charAt(0).toUpperCase();
  const pageTitle = title || "Dashboard";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Chatbots",
      path: "/chatbots",
      icon: Bot,
    },
    {
      name: "Documents",
      path: "/documents",
      icon: FileText,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },
    {
      name: "Billing",
      path: "/billing",
      icon: CreditCard,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">

      {/* ================================================= */}
      {/* MOBILE HEADER */}
      {/* ================================================= */}

      <header className="md:hidden fixed top-0 left-0 right-0 z-30 h-16 bg-white border-b border-[#e6e8ec] flex items-center px-5">

        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition"
        >
          <Menu size={20} />
        </button>

        <h1 className="ml-3 text-[16px] font-semibold text-[#344054]">
          {pageTitle}
        </h1>

        <div className="ml-auto w-8 h-8 rounded-full bg-[#2454ff] text-white flex items-center justify-center text-sm font-medium">
          {initial}
        </div>

      </header>


      {/* ================================================= */}
      {/* MOBILE OVERLAY */}
      {/* ================================================= */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/30 z-40"
        />
      )}


      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <aside
        className={`
          fixed
          top-0
          left-0
          z-50
          w-56
          h-screen
          bg-white
          border-r
          border-[#e6e8ec]
          flex
          flex-col
          transition-transform
          duration-300
          ease-in-out

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          md:translate-x-0
        `}
      >

        {/* ================= LOGO ================= */}

        <div className="h-16 px-5 flex items-center border-b border-[#e6e8ec]">

          <div className="flex items-center gap-2">

            <div className="w-7 h-7 rounded-lg bg-[#4c6fff] flex items-center justify-center text-white font-semibold">
              D
            </div>

            <span className="text-[16px] font-semibold text-[#344054]">
              DocuBot
            </span>

          </div>


          {/* Mobile Close */}

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden ml-auto p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>


        {/* ================= NAVIGATION ================= */}

        <nav className="px-3 pt-5">

          <div className="space-y-1">

            {navigation.map((item) => {

              const Icon = item.icon;

              const active =
                location.pathname === item.path ||
                (item.path === "/chatbots" &&
                  location.pathname.startsWith("/chatbots/"));

              return (
                <button
                  key={item.path}
                  onClick={() =>
                    handleNavigation(item.path)
                  }
                  className={`
                    w-full
                    flex
                    items-center
                    gap-3
                    px-3
                    py-2.5
                    rounded-lg
                    text-sm
                    transition

                    ${
                      active
                        ? "bg-[#eef1ff] text-[#2454ff] font-medium"
                        : "text-[#344054] hover:bg-gray-50"
                    }
                  `}
                >

                  <Icon
                    size={17}
                    strokeWidth={1.8}
                  />

                  <span>
                    {item.name}
                  </span>

                </button>
              );

            })}

          </div>

        </nav>


        {/* ================= SIDEBAR BOTTOM ================= */}

        <div className="mt-auto">

          <div className="border-t border-[#e6e8ec]" />


          {/* Help */}

          <div className="px-3 pt-5">

            <button
              className="
                w-full
                flex
                items-center
                gap-3
                px-3
                py-2.5
                rounded-lg
                text-[#344054]
                text-sm
                hover:bg-gray-50
                transition
              "
            >

              <CircleHelp
                size={18}
                strokeWidth={1.8}
              />

              <span>
                Help & Support
              </span>

            </button>

            <button
              onClick={handleLogout}
              className="
                w-full
                flex
                items-center
                gap-3
                px-3
                py-2.5
                rounded-lg
                text-[#b42318]
                text-sm
                hover:bg-red-50
                transition
              "
            >
              <LogOut size={18} strokeWidth={1.8} />
              <span>Log out</span>
            </button>

          </div>


          {/* User */}

          <div className="px-5 py-4">

            <div className="flex items-center gap-3">

              <div
                className="
                  w-8
                  h-8
                  rounded-full
                  bg-[#2454ff]
                  text-white
                  flex
                  items-center
                  justify-center
                  text-sm
                  font-medium
                  shrink-0
                "
              >
                {initial}
              </div>

              <div className="min-w-0">

                <p className="text-sm font-medium text-[#344054] truncate">
                  {displayName}
                </p>

                <p className="text-[11px] text-[#98a2b3] truncate">
                  {user?.email || ""}
                </p>

              </div>

            </div>

          </div>

        </div>

      </aside>


      {/* ================================================= */}
      {/* TOP NAVBAR */}
      {/* ================================================= */}

      <header
        className="
          hidden
          md:flex
          fixed
          top-0
          right-0
          z-20
          h-16
          bg-white
          border-b
          border-[#e6e8ec]
          items-center
          px-7
          md:left-56
        "
      >

        {/* Page Title */}

        <h1 className="text-[16px] font-semibold text-[#07142f]">
          {pageTitle}
        </h1>


        {/* Right Side */}

        <div className="ml-auto flex items-center gap-3">

          {/* Search */}

          <div className="relative">

            <Search
              size={16}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-[#98a2b3]
              "
            />

            <input
              type="text"
              placeholder="Search chatbots..."
              onKeyDown={(e) => {
                if (e.key === "Enter") navigate("/chatbots");
              }}
              className="
                w-64
                h-9
                pl-9
                pr-3
                rounded-lg
                border
                border-[#e0e4ea]
                bg-[#f8f9fb]
                text-sm
                text-[#344054]
                outline-none
                placeholder:text-[#98a2b3]
                focus:border-[#2454ff]
                focus:ring-1
                focus:ring-[#2454ff]
              "
            />

          </div>


          {/* Profile */}

          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className="
                w-8
                h-8
                rounded-full
                bg-[#2454ff]
                text-white
                flex
                items-center
                justify-center
                text-sm
                font-medium
              "
            >
              {initial}
            </button>

            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 top-11 z-20 w-52 bg-white border border-[#e6e8ec] rounded-lg shadow-lg py-1.5">
                  <div className="px-3.5 py-2 border-b border-[#f0f1f4]">
                    <p className="text-sm font-medium text-[#344054] truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-[#98a2b3] truncate">
                      {user?.email || ""}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/settings");
                    }}
                    className="w-full text-left px-3.5 py-2 text-sm text-[#344054] hover:bg-gray-50"
                  >
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3.5 py-2 text-sm text-[#b42318] hover:bg-red-50"
                  >
                    Log out
                  </button>
                </div>
              </>
            )}
          </div>

        </div>

      </header>


      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <main
        className="
          md:ml-56
          min-h-screen
          pt-16
        "
      >

        {children}

      </main>

    </div>
  );
};

export default DashboardLayout;