import React, { useEffect, useState } from "react";
import { documentApi } from "../../../services/documentApi";
import { Skeleton, StatusBadge } from "../../../components/ui/States";

const Overview = ({ chatbot }) => {
  const [docs, setDocs] = useState(null);

  useEffect(() => {
    let cancelled = false;
    documentApi
      .list()
      .then((res) => {
        if (!cancelled) {
          setDocs((res?.data || []).filter((d) => d.chatbot?._id === chatbot._id));
        }
      })
      .catch(() => {
        if (!cancelled) setDocs([]);
      });
    return () => {
      cancelled = true;
    };
  }, [chatbot._id]);

  const readyDocs = docs?.filter((d) => d.status === "ready").length ?? 0;

  return (
    <div className="grid md:grid-cols-3 gap-5">
      <div className="md:col-span-2 space-y-5">
        <div className="border border-[#e6e8ec] rounded-xl bg-white p-5">
          <h3 className="font-semibold text-[#07142f] mb-3">Description</h3>
          <p className="text-sm text-[#4b5468]">
            {chatbot.description || "No description provided yet."}
          </p>
        </div>

        <div className="border border-[#e6e8ec] rounded-xl bg-white p-5">
          <h3 className="font-semibold text-[#07142f] mb-3">Welcome message</h3>
          <p className="text-sm text-[#4b5468]">
            {chatbot.customization?.welcome_message || "Hi! How can I help you?"}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="border border-[#e6e8ec] rounded-xl bg-white p-5">
          <h3 className="font-semibold text-[#07142f] mb-3">Details</h3>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-[#8791a3]">Status</dt>
              <dd>
                <StatusBadge status={chatbot.status} />
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#8791a3]">Industry</dt>
              <dd className="text-[#344054]">{chatbot.industry}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#8791a3]">Language</dt>
              <dd className="text-[#344054]">{chatbot.language || "English"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#8791a3]">Documents</dt>
              <dd className="text-[#344054]">
                {docs === null ? <Skeleton className="h-4 w-8 inline-block" /> : docs.length}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#8791a3]">Ready to chat</dt>
              <dd className="text-[#344054]">
                {docs === null ? <Skeleton className="h-4 w-8 inline-block" /> : readyDocs > 0 ? "Yes" : "No"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#8791a3]">Created</dt>
              <dd className="text-[#344054]">
                {new Date(chatbot.createdAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>

        {readyDocs === 0 && (
          <div className="border border-[#ffe7b0] bg-[#fffaf0] rounded-xl p-4 text-sm text-[#8a5a00]">
            This chatbot has no ready documents yet, so it can't answer
            questions. Upload a PDF in the Documents tab to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
