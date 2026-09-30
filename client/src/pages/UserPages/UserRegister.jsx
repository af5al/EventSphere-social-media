import React, { useState } from "react";
import Myh1 from "../../components/Myh1";
import AuthInput from "../../components/AuthInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import Button1 from "../../components/Button1";
import { ServerVariables } from "../../utils/ServerVariables";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";

function UserRegister() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const registerSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "username must be 3 characters")
      .required("username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.number()
      .typeError("Invalid number") // Handles non-numeric input
      .positive("Phone number must be a positive number") // Handles negative numbers
      .integer("Phone number must be an integer") // Handles non-integer input
      .test(
        "len",
        "Phone number must be exactly 10 characters",
        (val) => val && val.toString().length === 10
      )
      .required("Phone number is required"),
    password: Yup.string()
      .min(6, "Password must be atleast 6 characters")
      .required("Password is required"),
    Cpassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "password must match")
      .required("Confirmation of password is required"),
  });

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
      let registerData = values;
      console.log(registerData);
      userRequest({
        url: apiEndPoints.postRegisterData,
        method: "post",
        data: registerData,
      })
        .then((res) => {
          dispatch(hideLoading());
          console.log(res.data);
          if (res.data.success) {
            navigate(ServerVariables.Otp, { state: { email: res.data.email } });
          } else {
            toast.error(res.data.error);
          }
        })
        .catch((err) => {
          dispatch(hideLoading());
          toast.error(err.message);
        });
    },
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
      <div className="flex w-full flex-col max-w-[400px] items-center space-y-3 py-2">
        <Myh1 title="Register User" />
        <div className="w-[270px] sm:w-full mt-10">
          <form onSubmit={formik.handleSubmit} noValidate>
            <AuthInput
              name="username"
              type="text"
              placeholder="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.username && formik.touched.username && (
              <p className="text-sm font-bold text-red-500">
                {formik.errors.username}
              </p>
            )}
            <AuthInput
              name="email"
              type="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.email && formik.touched.email && (
              <p className="text-sm font-bold text-red-500">
                {formik.errors.email}
              </p>
            )}
            <AuthInput
              name="phone"
              type="number"
              placeholder="Phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.phone && formik.touched.phone && (
              <p className="text-sm font-bold text-red-500">
                {formik.errors.phone}
              </p>
            )}
            <AuthInput
              name="password"
              type="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.password && formik.touched.password && (
              <p className="text-sm font-bold text-red-500">
                {formik.errors.password}
              </p>
            )}
            <AuthInput
              name="Cpassword"
              type="password"
              placeholder="Confirm Password"
              value={formik.values.Cpassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.Cpassword && formik.touched.Cpassword && (
              <p className="text-sm font-bold text-red-500">
                {formik.errors.Cpassword}
              </p>
            )}

            <Button1 text="Register" style={{ marginTop: 10 }} />
            <Link to={ServerVariables.Login}>
              <Button1 text="Back to login" style={{ marginTop: 10 }} />
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserRegister;
