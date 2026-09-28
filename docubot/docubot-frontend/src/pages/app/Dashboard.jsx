import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { chatbotApi } from "../../services/chatbotApi";
import { documentApi } from "../../services/documentApi";
import { useAuth } from "../../context/AuthContext";
import { Skeleton, ErrorState, StatusBadge } from "../../components/ui/States";
import { Bot } from "lucide-react";

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chatbots, setChatbots] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [cbRes, docRes] = await Promise.all([
        chatbotApi.list(),
        documentApi.list(),
      ]);
      setChatbots(cbRes?.data || []);
      setDocuments(docRes?.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, []);

  const readyDocs = documents?.filter((d) => d.status === "ready").length ?? 0;
  const processingDocs =
    documents?.filter((d) => d.status === "processing").length ?? 0;
  const failedDocs = documents?.filter((d) => d.status === "failed").length ?? 0;
  const activeChatbots =
    chatbots?.filter((c) => c.status === "active").length ?? 0;

  const recentChatbots = [...(chatbots || [])]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <DashboardLayout title="Dashboard">

      <div className="px-6 py-6">
        <h1 className="text-lg md:text-2xl font-extrabold text-[#07142f]">
          Dashboard
        </h1>
        <p className="mt-1 text-[10px] md:text-sm text-[#667085]">
          Welcome back{user?.name ? `, ${user.name}` : ""}
        </p>
      </div>

      {error && (
        <div className="px-6">
          <ErrorState message={error} onRetry={load} />
        </div>
      )}

      {!error && (
        <>
          {/* STAT CARDS */}
          <div className="px-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-[#e6e8ec] px-6 py-6 rounded-xl bg-white"
                >
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-9 w-16 mt-3" />
                  <Skeleton className="h-3 w-28 mt-3" />
                </div>
              ))
            ) : (
              <>
                <div className="border border-[#e6e8ec] px-6 py-6 rounded-xl bg-white">
                  <p className="font-medium text-[#8791a3] text-sm">
                    Total Chatbots
                  </p>
                  <p className="font-bold text-4xl mt-2 text-[#07142f]">
                    {chatbots.length}
                  </p>
                  <p className="text-[#667085] font-medium text-sm mt-3">
                    {activeChatbots} active
                  </p>
                </div>

                <div className="border border-[#e6e8ec] px-6 py-6 rounded-xl bg-white">
                  <p className="font-medium text-[#8791a3] text-sm">
                    Total Documents
                  </p>
                  <p className="font-bold text-4xl mt-2 text-[#07142f]">
                    {documents.length}
                  </p>
                  <p className="text-[#16804a] font-medium text-sm mt-3">
                    {readyDocs} ready
                  </p>
                </div>

                <div className="border border-[#e6e8ec] px-6 py-6 rounded-xl bg-white">
                  <p className="font-medium text-[#8791a3] text-sm">
                    Processing
                  </p>
                  <p className="font-bold text-4xl mt-2 text-[#07142f]">
                    {processingDocs}
                  </p>
                  <p className="text-[#b54708] font-medium text-sm mt-3">
                    documents in progress
                  </p>
                </div>

                <div className="border border-[#e6e8ec] px-6 py-6 rounded-xl bg-white">
                  <p className="font-medium text-[#8791a3] text-sm">
                    Failed Uploads
                  </p>
                  <p className="font-bold text-4xl mt-2 text-[#07142f]">
                    {failedDocs}
                  </p>
                  <p className="text-red-600 font-medium text-sm mt-3">
                    need attention
                  </p>
                </div>
              </>
            )}
          </div>

          {/* RECENT CHATBOTS */}
          <div className="px-6 mt-6 pb-8">
            <div className="border border-[#e6e8ec] rounded-xl bg-white overflow-hidden">
              <div className="px-5 py-5 flex items-center justify-between">
                <h2 className="font-semibold text-[#07142f]">
                  Recent Chatbots
                </h2>
                <button
                  onClick={() => navigate("/chatbots")}
                  className="text-sm text-[#2454ff] hover:underline"
                >
                  View all
                </button>
              </div>

              {loading ? (
                <div className="px-5 pb-5 space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : recentChatbots.length === 0 ? (
                <div className="px-5 pb-8 pt-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-[#f2f4f7] flex items-center justify-center text-[#98a2b3] mx-auto mb-3">
                    <Bot size={18} />
                  </div>
                  <p className="text-sm text-[#4b5468]">
                    You haven't created a chatbot yet.
                  </p>
                  <button
                    onClick={() => navigate("/chatbots")}
                    className="mt-3 text-sm font-medium text-[#2454ff] hover:underline"
                  >
                    Create your first chatbot
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="min-w-150 grid grid-cols-[2fr_1.2fr_1.5fr_0.6fr] px-4 py-3 border-t border-b border-[#e6e8ec] text-xs font-medium text-[#8791a3]">
                    <div>Name</div>
                    <div>Status</div>
                    <div>Created</div>
                    <div></div>
                  </div>

                  {recentChatbots.map((bot, idx) => (
                    <div
                      key={bot._id}
                      className={`min-w-150 grid grid-cols-[2fr_1.2fr_1.5fr_0.6fr] px-4 py-4 items-center text-sm ${
                        idx !== recentChatbots.length - 1
                          ? "border-b border-[#e6e8ec]"
                          : ""
                      }`}
                    >
                      <div className="font-semibold text-[#07142f] truncate pr-2">
                        {bot.name}
                      </div>
                      <div>
                        <StatusBadge status={bot.status} />
                      </div>
                      <div className="text-[#07142f]">
                        {timeAgo(bot.createdAt)}
                      </div>
                      <div>
                        <button
                          onClick={() => navigate(`/chatbots/${bot._id}`)}
                          className="text-[#2454ff] text-sm hover:underline"
                        >
                          Open
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
