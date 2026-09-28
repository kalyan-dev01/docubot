import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/Toast";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Email is required";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(form);
      toast.success("Welcome back!");
      const dest = location.state?.from?.pathname || "/dashboard";
      navigate(dest, { replace: true });
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
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
          <div className="mt-12">

            <h1 className="text-2xl font-bold text-[#07142f]">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-[#4b5468]">
              Log in to manage your chatbots.
            </p>

          </div>


          {/* Login Form */}
          <form className="mt-8" onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div>
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
            <div className="mt-5">

              <label className="block text-sm font-medium text-[#4b5468] mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={update("password")}
                className={`w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 ${
                  errors.password
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                    : "border-[#d7dbe1] focus:border-[#2454ff] focus:ring-[#2454ff]"
                }`}
              />
              {errors.password && (
                <p className="text-xs text-red-600 mt-1.5">{errors.password}</p>
              )}

            </div>


            {/* Sign In */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-6 bg-[#2454ff] text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? "Signing in…" : "Sign In"}
            </button>

            <p className="mt-5 text-center md:text-left md:ml-0 text-sm text-[#4b5468]">
              Don't have an account?{" "}
              <button type="button" className="cursor-pointer text-[#2454ff] font-medium" onClick={()=> navigate('/signup')}>
                Create account
              </button>
            </p>
          </form>

        </div>

      </section>


      {/* ================= RIGHT SIDE ================= */}
      <section className="hidden lg:flex lg:w-1/2 bg-[#21388f] text-white items-center">

        <div className="max-w-lg px-16">

          <h2 className="text-3xl font-bold leading-tight">
            Give every visitor an instant,
            <br />
            accurate answer.
          </h2>


          <p className="mt-5 text-blue-100 leading-6">
            DocuBot reads your documents and answers your
            customers' questions, in your brand voice, on your own website.
          </p>

        </div>

      </section>

    </div>
  );
};

export default Login;
