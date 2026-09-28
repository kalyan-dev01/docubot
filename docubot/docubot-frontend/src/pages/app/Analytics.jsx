import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { EmptyState } from "../../components/ui/States";
import { BarChart3 } from "lucide-react";

const Analytics = () => {
  return (
    <DashboardLayout title="Analytics">
      <div className="p-6">
        <h1 className="text-lg md:text-2xl font-extrabold text-[#07142f]">
          Analytics
        </h1>
        <p className="mt-1 text-[10px] md:text-sm text-[#667085]">
          Usage insights for your chatbots
        </p>

        <div className="mt-6 border border-[#e6e8ec] rounded-xl bg-white">
          <EmptyState
            icon={BarChart3}
            title="Analytics isn't available yet"
            description="The backend doesn't track questions, conversations, or usage metrics yet, so there's nothing real to show here. This page is ready to connect the moment those endpoints exist."
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
