import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { EmptyState } from "../../components/ui/States";
import { CreditCard } from "lucide-react";

const Billing = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout title="Billing">
      <div className="p-6">
        <h1 className="text-lg md:text-2xl font-extrabold text-[#07142f]">
          Billing
        </h1>
        <p className="mt-1 text-[10px] md:text-sm text-[#667085]">
          Plan and payment details
        </p>

        <div className="mt-6 border border-[#e6e8ec] rounded-xl bg-white">
          <EmptyState
            icon={CreditCard}
            title="Billing isn't connected yet"
            description="There's no payment provider or subscription API in the backend, so every account currently has full access at no charge. This page is ready to wire up once billing exists."
            action={
              <button
                onClick={() => navigate("/pricing")}
                className="text-sm font-medium text-[#2454ff] hover:underline"
              >
                View plans
              </button>
            }
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Billing;
