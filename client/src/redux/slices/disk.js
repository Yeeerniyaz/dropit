import { notifications } from "@mantine/notifications";
import { nprogress } from "@mantine/nprogress";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export const getdisk = createAsyncThunk(
  "disk/getdisk",
  async ({ id, sort }) => {
    if (!sort) {
      sort = "type";
    }
    if (!id) {
      const { data } = await axios.get(`/disk?sort=${sort}`);
      return data;
    } else {
      const { data } = await axios.get(`/disk?parent=${id}&sort=${sort}`);
      return data;
    }
  }
);

export const createDir = createAsyncThunk("disk/createDir", async (dirName) => {
  const { data } = await axios.post("/disk", dirName).catch((err) => {
    notifications.show({
      title: "Ошибка",
      message: err.response.data.message || "Ошибка сервера попробуйте позже",
      color: "red",
    });
  });
  return data;
});

export const uploadFile = createAsyncThunk(
  "disk/uploadFile",
  async ({ file, parent }) => {
    const formData = new FormData();
    formData.append("file", file);
    if (parent) {
      formData.append("parent", parent);
    }
    const { data } = await axios
      .post("/disk/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          let percent = Math.floor((loaded * 100) / total);
          nprogress.set(percent);
          if (percent === 100) {
            notifications.show({
              title: "Файл загружен",
              message: "Пожалуйста, подождите, пока файл будет обработан",
              color: "orange",
            });
          }
        },
      })
      .catch((err) => {
        notifications.show({
          title: "Ошибка",
          message:
            err.response.data.message || "Ошибка сервера попробуйте позже",
          color: "red",
        });
      });
    return data;
  }
);

export const deleteFile = createAsyncThunk("disk/deleteFile", async (id) => {
  const { data } = await axios.delete(`/disk/${id}`).catch((err) => {
    notifications.show({
      title: "Ошибка",
      message: err.response.data.message || "Ошибка сервера попробуйте позже",
      color: "red",
    });
  });
  return data;
});

export const searchFile = createAsyncThunk("disk/searchFile", async (name) => {
  const { data } = await axios.get(`/disk/search?search=${name}`);
  return data;
});

const initialState = {
  files: [],
  status: "null",
  error: null,
};

const diskSlice = createSlice({
  name: "disk",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getdisk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getdisk.fulfilled, (state, action) => {
        state.files = action.payload;
        state.status = "loaded";
        state.error = null;
      })
      .addCase(getdisk.rejected, (state, action) => {
        state.files = [];
        state.status = "error";
        state.error = action.error.message;
      })
      .addCase(createDir.pending, () => {
        notifications.show({
          title: "Создание папки",
          message: "Папка создается...",
          color: "orange",
        });
      })
      .addCase(createDir.fulfilled, (state, action) => {
        state.files.push(action.payload);
        state.status = "loaded";
        state.error = null;
        notifications.show({
          title: "Создание папки",
          message: "Папка успешно создана",
          color: "orange",
        });
      })
      .addCase(createDir.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.files.push(action.payload);
        state.status = "loaded";
        state.error = null;
        notifications.show({
          title: "Загрузка файла",
          message: "Файл успешно загружен",
          color: "orange",
        });
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteFile.pending, () => {
        notifications.show({
          title: "Удаление файла",
          message: "Файл удаляется...",
          color: "orange",
        });
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.files = state.files.filter(
          (file) => file._id !== action.meta.arg
        );
        state.status = "loaded";
        state.error = null;
        notifications.show({
          title: "Удаление файла",
          message: "Файл успешно удален",
          color: "orange",
        });
      })
      .addCase(searchFile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchFile.fulfilled, (state, action) => {
        state.files = action.payload;
        state.status = "loaded";
        state.error = null;
      })
      .addCase(searchFile.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
      });
  },
});

export const diskReducer = diskSlice.reducer;
