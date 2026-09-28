import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/app/Dashboard";
import Chatbots from "./pages/app/Chatbots";
import ChatbotDetail from "./pages/app/ChatbotDetail";
import Documents from "./pages/app/Documents";
import Analytics from "./pages/app/Analytics";
import Billing from "./pages/app/Billing";
import Settings from "./pages/app/Settings";
import PublicChat from "./pages/PublicChat";
import NotFound from "./pages/NotFound";

import { ProtectedRoute, PublicOnlyRoute } from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public marketing pages */}
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Public chatbot widget page (no auth - uses /api/public/chatbots/:id/chat) */}
        <Route path="/widget/:chatbotId" element={<PublicChat />} />

        {/* Auth pages - redirect away if already logged in */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Authenticated app */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chatbots" element={<Chatbots />} />
          <Route path="/chatbots/:chatbotId/*" element={<ChatbotDetail />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
