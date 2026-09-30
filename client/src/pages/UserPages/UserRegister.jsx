import React from "react";
import AuthInput from "../../components/AuthInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { ServerVariables } from "../../utils/ServerVariables";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import { FiUserPlus, FiArrowLeft } from "react-icons/fi";

const registerSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  Cpassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm your password"),
});

function UserRegister() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.loadings);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      Cpassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      dispatch(showLoading());
      userRequest({
        url: apiEndPoints.postRegisterData,
        method: "post",
        data: values,
      })
        .then((res) => {
          dispatch(hideLoading());
          if (res.data?.success) {
            toast.success("Verification code sent to email!");
            navigate(ServerVariables.Otp, { state: { email: res.data.email } });
          } else {
            toast.error(res.data?.error || "Registration failed");
          }
        })
        .catch((err) => {
          dispatch(hideLoading());
          toast.error(err.message || "An unexpected error occurred");
        });
    },
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg bg-[#111726]/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/30 relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to={ServerVariables.Login}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-400 transition-colors mb-6"
          >
            <FiArrowLeft className="text-sm" /> Back to Sign In
          </Link>
          <div className="inline-block p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-3 shadow-inner">
            <FiUserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Create an Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Join the EventSphere community to explore events, network, and find jobs
          </p>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Username
            </label>
            <AuthInput
              name="username"
              type="text"
              placeholder="johndoe"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.username && formik.touched.username && (
              <p className="text-xs font-medium text-rose-400 mt-1">
                {formik.errors.username}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <AuthInput
                name="phone"
                type="tel"
                placeholder="10-digit mobile"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.phone && formik.touched.phone && (
                <p className="text-xs font-medium text-rose-400 mt-1">
                  {formik.errors.phone}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <AuthInput
                name="password"
                type="password"
                placeholder="••••••••"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.password && formik.touched.password && (
                <p className="text-xs font-medium text-rose-400 mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Confirm Password
              </label>
              <AuthInput
                name="Cpassword"
                type="password"
                placeholder="••••••••"
                value={formik.values.Cpassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.Cpassword && formik.touched.Cpassword && (
                <p className="text-xs font-medium text-rose-400 mt-1">
                  {formik.errors.Cpassword}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-xs text-slate-400 pt-2">
            Already have an account?{" "}
            <Link
              to={ServerVariables.Login}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default UserRegister;
