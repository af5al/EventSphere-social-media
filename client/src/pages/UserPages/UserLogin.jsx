import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthInput from "../../components/AuthInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ServerVariables } from "../../utils/ServerVariables";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../../Redux/slices/AuthSlice";
import { FiEye, FiEyeOff, FiArrowLeft, FiLock, FiMail } from "react-icons/fi";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function UserLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPswd, setShowPswd] = useState(false);
  const { isLoading } = useSelector((state) => state.Auth);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      dispatch(loginThunk(values));
    },
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen px-4 py-12 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#111726]/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/30 relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to={ServerVariables.Landing}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-400 transition-colors mb-6"
          >
            <FiArrowLeft className="text-sm" /> Back to Home
          </Link>
          <div className="inline-block p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-3 shadow-inner">
            <FiLock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Enter your credentials to access your EventSphere account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <AuthInput
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.email && formik.touched.email && (
              <p className="text-xs font-medium text-rose-400 mt-1">
                {formik.errors.email}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                onClick={() => navigate(ServerVariables.VerifyEmail)}
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <AuthInput
                name="password"
                type={showPswd ? "text" : "password"}
                placeholder="••••••••"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <button
                type="button"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                onClick={() => setShowPswd(!showPswd)}
              >
                {showPswd ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
            {formik.errors.password && formik.touched.password && (
              <p className="text-xs font-medium text-rose-400 mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#111726] px-3 text-slate-400 font-medium">
                New to EventSphere?
              </span>
            </div>
          </div>

          <Link
            to={ServerVariables.Register}
            className="w-full py-3 px-4 rounded-xl font-medium text-sm text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all duration-200 flex items-center justify-center text-center shadow-sm"
          >
            Create an Account
          </Link>
        </form>
      </div>
    </div>
  );
}

export default UserLogin;
