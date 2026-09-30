import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiEndPoints } from "../../utils/api";
import { userRequest } from "../../Helper/instance";
import { toast } from "react-hot-toast";

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
  user: safeGetStorage("userInfo", {}),
  token: safeGetStorage("UserToken", null),
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await userRequest({
        url: apiEndPoints.postLogin,
        method: "POST",
        data: credentials,
      });

      if (res.data?.success) {
        toast.success(res.data.success);
        return res.data;
      } else {
        const errorMsg = res.data?.error || res.data?.message || "Login failed";
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "No response received from the server";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const AuthSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    loginPending: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.message = action.payload.success || "Login successful";
      localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
      localStorage.setItem("UserToken", JSON.stringify(action.payload.token));
    },
    loginReject: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.errorMsg = action.payload?.error || action.payload || "Login failed";
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logout: (state) => {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("UserToken");
      state.token = null;
      state.user = {};
      state.isSuccess = false;
      state.isError = false;
      state.errorMsg = "";
    },
    clearAuthStatus: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.errorMsg = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMsg = "";
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.message = action.payload.success || "Login successful";
        localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
        localStorage.setItem("UserToken", JSON.stringify(action.payload.token));
      })
      .addCase(loginThunk.rejected, (state, action) => {
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
  updateUser,
  logout,
  clearAuthStatus,
} = AuthSlice.actions;

export default AuthSlice.reducer;
