import { notifications } from "@mantine/notifications";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchLogin = createAsyncThunk("auth/login", async (params) => {
  const { data } = await axios.post("/auth/login", params).catch((err) => {
    notifications.show({
      title: "Ошибка",
      message: err.response.data.message || "Ошибка сервера попробуйте позже",
      color: "red",
    });
  });
  return data;
});

export const fetchRegister = createAsyncThunk(
  "auth/register",
  async (params) => {
    const { data } = await axios.post("/auth/register", params).catch((err) => {
      notifications.show({
        title: "Ошибка",
        message: err.response.data.message || "Ошибка сервера попробуйте позже",
        color: "red",
      });
    });
    return data;
  }
);

export const fetchAuth = createAsyncThunk("auth/auth", async () => {
  const { data } = await axios.get("/auth").catch((err) => {
    notifications.show({
      title: "Ошибка",
      message: err.response.data.message || "Ошибка сервера попробуйте позже",
      color: "red",
    });
  });
  return data;
});

const initialState = {
  user: null,
  status: "null",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = "null";
      state.error = null;
      localStorage.removeItem("token");
    },
    addShare: (state, action) => {
      state.user.shares.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "loaded";
        state.error = null;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.user = null;
        state.status = "error";
        state.error = action.error.message;
      })
      .addCase(fetchRegister.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "loaded";
        state.error = null;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(fetchRegister.rejected, (state, action) => {
        state.user = null;
        state.status = "error";
        state.error = action.error.message;
      })
      .addCase(fetchAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "loaded";
        state.error = null;
      })
      .addCase(fetchAuth.rejected, (state, action) => {
        state.user = null;
        state.status = "error";
        state.error = action.error.message;
        localStorage.removeItem("token");
      });
  },
});

export const { logout } = authSlice.actions;
export const { addShare } = authSlice.actions;
export const SelectUser = (state) => Boolean(state.auth.user);
export const AuthReducer = authSlice.reducer;
