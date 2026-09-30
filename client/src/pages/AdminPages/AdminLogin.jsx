import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthInput from "../../components/AuthInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ServerVariables } from "../../utils/ServerVariables";
import { useDispatch, useSelector } from "react-redux";
import { AdminLoginThunk } from "../../Redux/slices/AdminAuthSlice";
import { FiEye, FiEyeOff, FiArrowLeft, FiShield } from "react-icons/fi";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function AdminLogin() {
  const [showPswd, setShowPswd] = useState(false);
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.AdminAuth);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      dispatch(AdminLoginThunk(values));
    },
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen px-4 py-12 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#111726]/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/30 relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to={ServerVariables.Landing}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors mb-6"
          >
            <FiArrowLeft className="text-sm" /> Back to Home
          </Link>
          <div className="inline-block p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-3 shadow-inner">
            <FiShield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Admin Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Authorized personnel only. Enter administrator credentials.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Admin Email
            </label>
            <AuthInput
              name="email"
              type="email"
              placeholder="admin@eventsphere.online"
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
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Admin Key / Password
            </label>
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
            className="w-full mt-2 py-3.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : "Access Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
