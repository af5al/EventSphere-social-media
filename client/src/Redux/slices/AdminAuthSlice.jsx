import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiEndPoints } from "../../utils/api";
import { adminRequest } from "../../Helper/instance";
import toast from "react-hot-toast";

const safeGetStorage = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return item.startsWith("{") || item.startsWith("[") || item.startsWith('"')
      ? JSON.parse(item)
      : item;
  } catch (err) {
    return fallback;
  }
};

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  errorMsg: "",
  message: "",
  admin: safeGetStorage("adminInfo", {}),
  token: safeGetStorage("adminToken", null),
};

export const AdminLoginThunk = createAsyncThunk(
  "adminAuth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await adminRequest({
        url: apiEndPoints.postLoginAdmin,
        method: "POST",
        data: credentials,
      });

      if (res.data?.success) {
        toast.success(res.data.success);
        return res.data;
      } else {
        const errorMsg = res.data?.error || res.data?.message || "Admin login failed";
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Request failed";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const AdminAuthSlice = createSlice({
  name: "AdminAuth",
  initialState,
  reducers: {
    loginPending: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.admin = action.payload.admin;
      state.token = action.payload.token;
      state.message = action.payload.success || "Login successful";
      localStorage.setItem("adminInfo", JSON.stringify(action.payload.admin));
      localStorage.setItem("adminToken", JSON.stringify(action.payload.token));
    },
    loginReject: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.errorMsg = action.payload?.error || action.payload || "Login failed";
    },
    logout: (state) => {
      localStorage.removeItem("adminInfo");
      localStorage.removeItem("adminToken");
      state.token = null;
      state.admin = {};
      state.isSuccess = false;
      state.isError = false;
      state.errorMsg = "";
    },
    clearAdminAuthStatus: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.errorMsg = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AdminLoginThunk.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMsg = "";
      })
      .addCase(AdminLoginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
        state.message = action.payload.success || "Login successful";
        localStorage.setItem("adminInfo", JSON.stringify(action.payload.admin));
        localStorage.setItem("adminToken", JSON.stringify(action.payload.token));
      })
      .addCase(AdminLoginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.errorMsg = action.payload || "Authentication failed";
      });
  },
});

export const {
  loginPending,
  loginSuccess,
  loginReject,
  logout,
  clearAdminAuthStatus,
} = AdminAuthSlice.actions;

export default AdminAuthSlice.reducer;
