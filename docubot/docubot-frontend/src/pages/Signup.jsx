import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/Toast";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Full name is required";
    if (!form.email.trim()) next.email = "Email is required";
    if (!form.password) {
      next.password = "Password is required";
    } else if (form.password.length < 8) {
      next.password = "At least 8 characters, with a number and a symbol";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await signup(form);
      toast.success("Account created — welcome to DocuBot!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ================= LEFT SIDE ================= */}
      <section className="w-full lg:w-1/2 flex justify-center">

        <div className="w-full max-w-md px-6 py-10">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 text-lg text-white rounded-md font-bold bg-blue-600 cursor-pointer" onClick={()=> navigate('/')}>
              D
            </span>

            <span className="text-xl font-bold text-gray-900">
              DocuBot
            </span>
          </div>


          {/* Heading */}
          <div className="mt-10">

            <h1 className="text-2xl font-bold text-[#07142f]">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-[#4b5468]">
              Start building your AI chatbot today.
            </p>

          </div>


          {/* Signup Form */}
          <form className="mt-7" onSubmit={handleSubmit} noValidate>

            {/* Full Name */}
            <div>

              <label className="block text-sm font-medium text-[#4b5468] mb-2">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={update("name")}
                className={`w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 ${
                  errors.name
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                    : "border-[#d7dbe1] focus:border-[#2454ff] focus:ring-[#2454ff]"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1.5">{errors.name}</p>
              )}

            </div>


            {/* Email */}
            <div className="mt-4">

              <label className="block text-sm font-medium text-[#4b5468] mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={update("email")}
                className={`w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 ${
                  errors.email
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                    : "border-[#d7dbe1] focus:border-[#2454ff] focus:ring-[#2454ff]"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1.5">{errors.email}</p>
              )}

            </div>


            {/* Password */}
            <div className="mt-4">

              <label className="block text-sm font-medium text-[#4b5468] mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
                value={form.password}
                onChange={update("password")}
                className={`w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 ${
                  errors.password
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                    : "border-[#d7dbe1] focus:border-[#2454ff] focus:ring-[#2454ff]"
                }`}
              />
              {errors.password ? (
                <p className="text-xs text-red-600 mt-1.5">{errors.password}</p>
              ) : (
                <p className="text-xs text-[#98a2b3] mt-1.5">
                  Minimum 8 characters, with at least 1 number and 1 symbol.
                </p>
              )}

            </div>


            {/* Create Account */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-5 bg-[#2454ff] text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? "Creating account…" : "Create Account"}
            </button>


            {/* Login */}
            <p className="text-center text-sm text-[#4b5468] mt-6">
              Already have an account?
              <button type="button" className="ml-1 text-[#2454ff] font-medium hover:underline" onClick={()=> navigate('/login')}>
                Log in
              </button>
            </p>

          </form>

        </div>

      </section>


      {/* ================= RIGHT SIDE ================= */}
      <section className="hidden lg:flex lg:w-1/2 bg-[#21388f] text-white items-center">

        <div className="max-w-lg px-16">

          <h2 className="text-3xl font-bold leading-tight">
            Launch a trained AI chatbot without
            <br />
            writing code.
          </h2>


          <p className="mt-5 text-blue-100 leading-6">
            Upload your documents, customize the look and feel,
            and embed it on your site in minutes.
          </p>

        </div>

      </section>

    </div>
  );
};

export default Signup;
