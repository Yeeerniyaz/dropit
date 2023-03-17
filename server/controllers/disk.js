import User from "../models/User.js";
import Disk from "../models/disk.js";

import fs from "fs";
import path from "path";

export async function Getdisk(req, res) {
  try {
    const userId = req.userId;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sort = req.query.sort;
    const parent = req.query.parent;

    const files = await Disk.find({
      user: user._id,
      parent: parent || null,
    }).sort({
      [sort]: 1,
    });

    return res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера, попробуйте позже" });
  }
}

export async function CreateDir(req, res) {
  try {
    const { name, type, parent } = req.body;
    const file = new Disk({ name, type, parent, user: req.userId });
    const parentFile = await Disk.findOne({ _id: parent });
    if (!parentFile) {
      file.path = name;
      if (!fs.existsSync(`files/${file.user}/${file.path}`)) {
        fs.mkdirSync(`files/${file.user}/${file.path}`);
        await file.save();
        return res.status(200).json(file);
      } else {
        return res.status(400).json({ message: "Такая папка уже есть" });
      }
    } else {
      file.path = `${parentFile.path}/${file.name}`;
      if (!fs.existsSync(`files/${file.user}/${file.path}`)) {
        fs.mkdirSync(`files/${file.user}/${file.path}`);
        parentFile.childs.push(file._id);
        await parentFile.save();
        await file.save();
        return res.status(200).json(file);
      } else {
        return res.status(400).json({ message: "Такая папка уже есть" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера, попробуйте позже" });
  }
}

export async function DeleteFile(req, res) {
  try {
    const user = await User.findById(req.userId);
    const { id } = req.params;

    if (!user) {
      return res.status(404).json({ message: "Нет доступа" });
    }

    const file = await Disk.findOne({ _id: id, user: user._id });

    if (!file) {
      return res.status(404).json({ message: "Нет доступа" });
    }

    if (file.type === "dir") {
      const files = await Disk.find({ parent: file._id });
      if (files.length) {
        return res.status(400).json({ message: "Папка не пуста" });
      } else {
        fs.rmdirSync(`files/${user._id}/${file.path}`);
      }
    } else {
      fs.unlinkSync(`files/${user._id}/${file.path}`);
      user.usedSpace -= file.size;
    }

    await user.save();

    await Disk.findByIdAndRemove(id);

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера, попробуйте позже" });
  }
}

export async function FileUpload(req, res) {
  try {
    const file = req.files.file;
    const parent = req.body.parent;
    const type = file.name.split(".").pop();
    const fileName = (file.name = Buffer.from(file.name, "latin1").toString(
      "utf8"
    ));

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "Нет доступа" });
    }

    if (user.usedSpace + file.size > user.diskSpace) {
      return res.status(400).json({ message: "Недостаточно места на диске" });
    }

    user.usedSpace += file.size;

    const disk = new Disk({
      name: fileName,
      size: file.size,
      mimeTypes: file.mimetype,
      user: req.userId,
      type,
      parent,
    });

    if (parent) {
      const parentFile = await Disk.findOne({ _id: parent, user: user._id });
      if (!parentFile) {
        return res.status(404).json({ message: "No access" });
      }
      parentFile.childs.push(disk._id);
      await parentFile.save();
      disk.path = `${parentFile.path}/${fileName}`;
      if (fs.existsSync(`files/${user._id}/${parentFile.path}/${fileName}`)) {
        return res.status(400).json({ message: "Такой файл уже существует" });
      }
      file.mv(`files/${user._id}/${parentFile.path}/${fileName}`);
      await disk.save();
      await user.save();
    } else {
      disk.path = fileName;
      if (fs.existsSync(`files/${user._id}/${fileName}`)) {
        return res.status(400).json({ message: "Такой файл уже существует" });
      }
      file.mv(`files/${user._id}/${fileName}`);
      await disk.save();
      await user.save();
    }

    res.status(200).json(disk);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера, попробуйте позже" });
  }
}

export async function FileDownload(req, res) {
  const { id } = req.params;
  const user = await User.findById(req.userId);
  const file = await Disk.findOne({ _id: id, user: user._id });

  if (!file) {
    return res.status(404).json({ message: "No access" });
  }

  const filePath = path.resolve(`files/${user._id}/${file.path}`);
  res.download(filePath, file.name);
  try {
  } catch (err) {
    res.status(500).json({ message: err });
  }
}

export async function GetSizeDir(req, res) {
  try {
    const { id } = req.params;
    const dir = Disk.findOne({ _id: id });
    const files = await Disk.find({ parent: dir._id });

    const size = files.reduce((acc, file) => {
      return acc + file.size;
    }, 0);

    dir.size.push(size);
    await dir.save();

    res.status(200).json(size);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
