import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiEndPoints } from "../../utils/api";
import { eventRequest } from "../../Helper/instance";
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
  event: safeGetStorage("eventInfo", {}),
  token: safeGetStorage("eventToken", null),
};

export const EventLoginThunk = createAsyncThunk(
  "eventAuth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await eventRequest({
        url: apiEndPoints.postEventLogin,
        method: "POST",
        data: credentials,
      });

      if (res.data?.success) {
        toast.success(res.data.success);
        return res.data;
      } else {
        const errorMsg = res.data?.error || res.data?.message || "Event login failed";
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

export const EventAuthSlice = createSlice({
  name: "EventAuth",
  initialState,
  reducers: {
    loginPending: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.event = action.payload.event;
      state.token = action.payload.token;
      state.message = action.payload.success || "Login successful";
      localStorage.setItem("eventInfo", JSON.stringify(action.payload.event));
      localStorage.setItem("eventToken", JSON.stringify(action.payload.token));
    },
    loginReject: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.errorMsg = action.payload?.error || action.payload || "Login failed";
    },
    updateEvent: (state, action) => {
      state.event = action.payload;
      localStorage.setItem("eventInfo", JSON.stringify(action.payload));
    },
    logout: (state) => {
      localStorage.removeItem("eventInfo");
      localStorage.removeItem("eventToken");
      state.token = null;
      state.event = {};
      state.isSuccess = false;
      state.isError = false;
      state.errorMsg = "";
    },
    clearEventAuthStatus: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.errorMsg = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(EventLoginThunk.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMsg = "";
      })
      .addCase(EventLoginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.event = action.payload.event;
        state.token = action.payload.token;
        state.message = action.payload.success || "Login successful";
        localStorage.setItem("eventInfo", JSON.stringify(action.payload.event));
        localStorage.setItem("eventToken", JSON.stringify(action.payload.token));
      })
      .addCase(EventLoginThunk.rejected, (state, action) => {
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
  updateEvent,
  logout,
  clearEventAuthStatus,
} = EventAuthSlice.actions;

export default EventAuthSlice.reducer;
