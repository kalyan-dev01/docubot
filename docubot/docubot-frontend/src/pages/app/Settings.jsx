import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <DashboardLayout title="Settings">
      <div className="p-6 max-w-2xl">
        <h1 className="text-lg md:text-2xl font-extrabold text-[#07142f]">
          Settings
        </h1>
        <p className="mt-1 text-[10px] md:text-sm text-[#667085]">
          Your account details
        </p>

        <div className="mt-6 border border-[#e6e8ec] rounded-xl bg-white p-5">
          <h3 className="font-semibold text-[#07142f] mb-4">Profile</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#8791a3] mb-1">
                Name
              </label>
              <p className="text-sm text-[#344054]">{user?.name || "-"}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#8791a3] mb-1">
                Email
              </label>
              <p className="text-sm text-[#344054]">{user?.email || "-"}</p>
            </div>
          </div>

          <p className="text-xs text-[#98a2b3] mt-5 border-t border-[#f0f1f4] pt-4">
            The backend doesn't yet expose an endpoint to update your name,
            email, or password, or to delete your account - this page is
            read-only until those exist.
          </p>
        </div>

        <div className="mt-5 border border-[#e6e8ec] rounded-xl bg-white p-5 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[#07142f]">Log out</h3>
            <p className="text-sm text-[#667085] mt-1">
              End your session on this device.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-lg text-sm font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition"
          >
            Log out
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
