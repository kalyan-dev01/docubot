import React from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import Navbar from "../components/Navbar";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    description: "Try DocuBot with a single chatbot.",
    features: ["1 chatbot", "1 document", "Community support"],
    cta: "Get started",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "For teams shipping a production chatbot.",
    features: [
      "Unlimited chatbots",
      "Unlimited documents",
      "Public embeddable chat",
      "Priority support",
    ],
    cta: "Get started",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Contact us",
    period: "",
    description: "Custom limits, SSO, and dedicated support.",
    features: ["Custom deployment", "SLAs", "Dedicated support"],
    cta: "Contact sales",
  },
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#07142f]">
            Simple, transparent pricing
          </h1>
          <p className="mt-3 text-[#4b5468]">
            Start free. Upgrade when your chatbot is ready for real traffic.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-6 flex flex-col ${
                plan.highlighted
                  ? "border-[#2454ff] shadow-lg shadow-blue-100"
                  : "border-[#e6e8ec]"
              }`}
            >
              <h3 className="font-semibold text-[#07142f]">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[#07142f]">
                  {plan.price}
                </span>
                <span className="text-sm text-[#8791a3]">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-[#4b5468]">{plan.description}</p>

              <ul className="mt-5 space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#344054]">
                    <Check size={16} className="text-[#2454ff] mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate("/signup")}
                className={`mt-6 w-full py-2.5 rounded-lg text-sm font-medium transition ${
                  plan.highlighted
                    ? "bg-[#2454ff] text-white hover:bg-[#1b3fd1]"
                    : "border border-[#d7dbe1] hover:bg-gray-50"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[#98a2b3] mt-10">
          Billing isn't wired up to a payment provider yet — every account currently
          gets full access while DocuBot is in early access.
        </p>
      </div>
    </div>
  );
};

export default Pricing;
