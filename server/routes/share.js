import { Router } from "express";
import { Upload, Download, Update, GetOne } from "../controllers/share.js";
import isAuth from '../middleware/isAuth.js';
const router = Router();


router.post("/upload", isAuth, Upload);

router.get("/download/:id", Download);

router.patch("/update", isAuth, Update);

router.get("/:id", GetOne);


export default router;
