import express from "express";
import fileUpload from "express-fileupload";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cron from "cron";
import cors from "cors";

import ShareRoutes from "./routes/share.js";
import DashboardRoutes from "./routes/dashboard.js";
import AuthRoutes from "./routes/auth.js";
import diskRoutes from "./routes/disk.js";

import Share from "./models/Share.js";
import fs from "fs";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload({}));

mongoose
  .set("strictQuery", false)
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("DB connection established"))
  .catch((err) => console.log(err));

app.use("/files", express.static("files"));
app.use("/share", ShareRoutes);
app.use("/dashboard", DashboardRoutes);
app.use("/auth", AuthRoutes);
app.use("/disk", diskRoutes);

const job = new cron.CronJob(" 0 0 * * *", async () => {
  try {
    const data = await Share.find({
      isTerm: false,
    });

    if (data.length > 0) {
      data.forEach((item) => {
        const { term } = item;
        const { createdAt } = item;
        const date = new Date(createdAt);
        const dateFuture = new Date(date.getTime() + term);
        const dateNow = new Date();
        if (dateNow > dateFuture) {
          item.isTerm = true;
          item.save();
          fs.unlinkSync(item.url);
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
});

job.start();

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Local port is " + process.env.PORT);
  }
});
