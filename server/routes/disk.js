import { Router } from "express";
import isAuth from "../middleware/isAuth.js";

import {
  Getdisk,
  CreateDir,
  DeleteFile,
  FileUpload,
  FileDownload,
} from "../controllers/disk.js";

const router = Router();

router.get("", isAuth, Getdisk);

router.post("", isAuth, CreateDir);

router.delete("/:id", isAuth, DeleteFile);

router.post("/upload", isAuth, FileUpload);

router.get("/download/:id", isAuth, FileDownload);

export default router;
