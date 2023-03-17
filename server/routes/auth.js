import { Router } from "express";
import { Register, Login, GetMe } from "../controllers/auth.js";

import isAuth from "../middleware/isAuth.js";

const router = Router();

router.get("", isAuth, GetMe);

router.post("/register", Register);

router.post("/login", Login);

export default router;
