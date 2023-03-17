import Share from "../models/Share.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
}

async function findSender(req, sender) {
  const user = req.userId
    ? await User.findById(req.userId)
    : await User.findOne({ email: sender });
  const email = user ? user.email : "Неизвестный отправитель";
  return sender || email;
}

const terms = {
  "7d": 1000 * 60 * 60 * 24 * 7,
  "15d": 1000 * 60 * 60 * 24 * 15,
  "30d": 1000 * 60 * 60 * 24 * 30,
  "90d": 1000 * 60 * 60 * 24 * 90,
};

export async function Upload(req, res) {
  try {
    const { values } = req.body;
    const body = JSON.parse(values);
    const file = req.files.file;
    const sender = body.sender;
    const termString = body.term;

    if (!file) {
      return res.status(400).json({ message: "Файл не выбран" });
    }

    const fileName =
      Date.now() +
      "-" +
      (file.name = Buffer.from(file.name, "latin1").toString("utf8"));

    const filePath = path.join("uploads", fileName);

    ensureDirectoryExists("uploads");

    const fileStream = fs.createWriteStream(filePath);
    fileStream.write(file.data);
    fileStream.end();

    const term = terms[termString];

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(body.code, salt);

    const type = path.extname(file.name).substring(1);
    const newFile = new Share({
      url: filePath,
      type,
      size: file.size,
      name: fileName,
      sender: await findSender(req, sender),
      receiver: body.receiver,
      term: term,
      code: body.code ? hash : undefined,
    });

    const savedFile = await newFile.save();

    if (req.userId) {
      const user = await User.findById(req.userId);
      user.shares.push(savedFile._id);
      await user.save();
    }

    if (body.receiver) {
      const user = await User.findOne({ email: body.receiver });
      if (user) {
        user.resiver.push(savedFile._id);
        await user.save();
      }
    }

    res.json(savedFile);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Ошибка сервера, Пожалуйста, попробуйте еще раз" });
  }
}

export async function Download(req, res) {
  try {
    const file = await Share.findById(req.params.id);
    const code = req.headers.code;

    if (!file) {
      return res.status(404).json({ success: false, error: "File not found" });
    }

    if (file.code) {
      const isMatch = await bcrypt.compare(code, file.code);
      if (!isMatch) {
        return res.status(403).json({ message: "Неверный код" });
      }
    }

    if (file.term === 7776000000) {
      file.term = -1;
      await file.save();
    }

    res.download(file.url);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function Update(req, res) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.code, salt);

    const file = await Share.findOneAndUpdate(
      { _id: req.params.id },
      {
        sender: req.body?.sender,
        receiver: req.body?.receiver,
        term: req.body?.term,
        code: req.body.code ? hash : undefined,
      }
    );

    if (!file) {
      return res.status(404).json({ success: false, error: "File not found" });
    }

    await file.save();

    if (req.body.receiver) {
      const user = await User.findOne({ email: req.body.receiver });
      if (user) {
        user.resiver.push(file._id);
        await user.save();
      }
    }

    if (req.body.sender) {
      const user = await User.findOne({ email: req.body.sender });
      if (user) {
        user.shares.push(file._id);
        await user.save();
      }
    }

    res.status(200).json({ success: true, file });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function GetOne(req, res) {
  try {
    const file = await Share.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ success: false, error: "File not found" });
    }

    res.status(200).json(file);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
