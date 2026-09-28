import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  const navigate = useNavigate();
  return ( 
  <div>
    <Navbar/>
        <div className="max-w-6xl mx-auto px-6 py-10 md:py-14 lg:py-16">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* LEFT SIDE */}
        <section className="w-full lg:w-1/2">
          {/* Badge */}
          <span className="inline-block text-[#1b3fd1] rounded-xl px-3 py-1 text-xs sm:text-sm font-semibold bg-[#eef1ff]">
            New — RAG-powered answers with citations
          </span>
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight mt-5 text-[#07142f]">
            Turn Your Documents Into an AI Chatbot
          </h1>
          {/* Description */}
          <p className="mt-6 text-base sm:text-lg leading-7 text-[#4b5468] max-w-xl">
            Create a custom AI assistant trained on your business knowledge
            and embed it directly into your website.
          </p>
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-7">
            <button
              onClick={() => navigate('/signup')}
              className="bg-[#1b3fd1] text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Get Started Free
            </button>

            <button
              onClick={() => navigate('/pricing')}
              className="border border-[#8791a3] px-5 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              View Pricing
            </button>

          </div>

          {/* Info */}
          <div className="flex flex-wrap items-center text-sm gap-2 mt-5 text-[#8791a3]">
            <p>No credit card required</p>
            <p>·</p>
            <p>Setup in under 10 minutes</p>
          </div>

        </section>


        {/* RIGHT SIDE */}
        <section className="w-full lg:w-1/2 flex justify-center">

          <div className="w-full max-w-md border border-gray-200 rounded-xl shadow-lg overflow-hidden bg-white">

            {/* Chat Header */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">

              <span className="bg-[#2454ff] w-9 h-9 flex items-center justify-center text-white font-bold rounded-full">
                A
              </span>

              <div>
                <p className="font-semibold text-sm">
                  Acme Support
                </p>

                <div className="flex items-center gap-1 text-xs text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>Online</span>
                </div>
              </div>

            </div>


            {/* Chat Body */}
            <div className="bg-[#f8f9fb] px-4 py-5 space-y-4">

              {/* Bot Message */}
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 w-fit max-w-[85%] text-sm">
                Hi! 👋 How can I help you today?
              </div>


              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-[#2454ff] text-white rounded-xl px-4 py-3 text-sm max-w-[85%]">
                  What is your refund policy?
                </div>
              </div>


              {/* Bot Response */}
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 max-w-[90%] text-sm">

                <p className="text-gray-800 leading-5">
                  Our refund policy allows customers to
                  request a refund within 30 days of
                  purchase.
                </p>

                <p className="text-[#2454ff] font-semibold text-xs mt-2">
                  Source: Refund_Policy.pdf · Page 12
                </p>

              </div>

            </div>


            {/* Input */}
            <div className="border-t border-gray-200 p-3 flex items-center gap-2">

              <input
                type="text"
                placeholder="Ask a question..."
                className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2454ff]"
              />

              <button className="shrink-0 border border-gray-300 rounded-lg px-3 py-2 text-[#4b5468] hover:bg-gray-50">
                
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>  
  );
};

export default Home;