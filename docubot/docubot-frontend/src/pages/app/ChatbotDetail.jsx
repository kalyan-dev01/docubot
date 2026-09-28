import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation, Routes, Route } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { chatbotApi } from "../../services/chatbotApi";
import { Skeleton, ErrorState, StatusBadge } from "../../components/ui/States";
import { ArrowLeft } from "lucide-react";

import Overview from "./chatbot/Overview";
import DocumentsTab from "./chatbot/DocumentsTab";
import CustomizeTab from "./chatbot/CustomizeTab";
import TestChatTab from "./chatbot/TestChatTab";
import EmbedTab from "./chatbot/EmbedTab";

const TABS = [
  { key: "", label: "Overview" },
  { key: "documents", label: "Documents" },
  { key: "customize", label: "Customize" },
  { key: "chat", label: "Test Chat" },
  { key: "embed", label: "Embed" },
];

const ChatbotDetail = () => {
  const { chatbotId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [chatbot, setChatbot] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await chatbotApi.get(chatbotId);
      setChatbot(res?.data || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [chatbotId]);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  const base = `/chatbots/${chatbotId}`;
  const activeTab = location.pathname.replace(base, "").replace(/^\//, "");

  return (
    <DashboardLayout title={chatbot?.name || "Chatbot"}>
      <div className="px-6 py-6">
        <button
          onClick={() => navigate("/chatbots")}
          className="flex items-center gap-1.5 text-sm text-[#667085] hover:text-[#2454ff] transition mb-4"
        >
          <ArrowLeft size={15} /> Back to chatbots
        </button>

        {loading && (
          <div>
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-80 mt-3" />
          </div>
        )}

        {!loading && error && <ErrorState message={error} onRetry={load} />}

        {!loading && !error && chatbot && (
          <>
            <div className="flex items-center gap-3 flex-wrap">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold shrink-0"
                style={{ backgroundColor: chatbot.customization?.primary_color || "#2454ff" }}
              >
                {chatbot.name?.charAt(0)?.toUpperCase() || "B"}
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-extrabold text-[#07142f]">
                  {chatbot.name}
                </h1>
                <p className="text-sm text-[#667085]">{chatbot.industry}</p>
              </div>
              <StatusBadge status={chatbot.status} />
            </div>

            {/* Tabs */}
            <div className="mt-6 border-b border-[#e6e8ec] flex gap-6 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => navigate(`${base}${tab.key ? `/${tab.key}` : ""}`)}
                  className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                    activeTab === tab.key
                      ? "border-[#2454ff] text-[#2454ff]"
                      : "border-transparent text-[#667085] hover:text-[#344054]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-6 pb-10">
              <Routes>
                <Route index element={<Overview chatbot={chatbot} />} />
                <Route
                  path="documents"
                  element={<DocumentsTab chatbot={chatbot} />}
                />
                <Route
                  path="customize"
                  element={<CustomizeTab chatbot={chatbot} onUpdated={setChatbot} />}
                />
                <Route path="chat" element={<TestChatTab chatbot={chatbot} />} />
                <Route path="embed" element={<EmbedTab chatbot={chatbot} onUpdated={setChatbot} />} />
              </Routes>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ChatbotDetail;
