import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

import { notifications } from "@mantine/notifications";
import { nprogress } from "@mantine/nprogress";

export const dropUpload = createAsyncThunk(
  "dropIt/dropUpload",
  async (file) => {
    const { data } = await axios
      .post("/share/upload", file, {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          let percent = Math.floor((loaded * 100) / total);
          nprogress.set(percent);
          if (percent === 100) {
            notifications.show({
              title: "Файл загружен",
              message: "Пожалуйста, подождите, пока сслыка будет сгенерирована",
              color: "orange",
            });
          }
        },
      })
      .catch((res) => {
        notifications.show({
          title: "Ошибка загрузки файла",
          message: res.data.message || "Пожалуйста, попробуйте еще раз ",
          color: "red",
        });
      });
    return data;
  }
);

const initialState = {
  status: "null",
  error: null,
  data: null,
  download: null,
};

const dropSlice = createSlice({
  name: "dropIt",
  initialState,
  reducers: {
    resetDropIt: (state) => {
      state.status = "null";
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (bulider) => {
    bulider
      .addCase(dropUpload.pending, (state) => {
        state.status = "loading";
      })
      .addCase(dropUpload.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "loaded";
        state.error = null;
        navigator.clipboard.writeText(
          window.location.origin + "/share/" + action.payload._id
        );
        notifications.show({
          title: "Ссылка скопирована",
          message: "Ссылка скопирована в буфер обмена",
          color: "orange",
        });
      })
      .addCase(dropUpload.rejected, (state) => {
        state.data = null;
        state.status = "error";
      });
  },
});

export const { resetDropIt } = dropSlice.actions;

export const dropReducer = dropSlice.reducer;
