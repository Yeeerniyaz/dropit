import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";

export async function GetMe(req, res) {
  try {
    const userId = req.userId;
    const user = await User.findOne({ _id: userId })
      .select("-password")
      .populate({ path: "shares", options: { sort: { createdAt: -1 } } })
      .populate({ path: "resiver", options: { sort: { createdAt: -1 } } });

    if (!user) {
      return res.status(405).json({ message: "Этот пользователь не найден" });
    }

    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Ошибка сервера, повторите попытку позже" });
  }
}

export async function Login(req, res) {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(405).json({ message: "Логин или пароль не введены" });
    }

    const user = await User.findOne({ email: req.body.email })
      .populate("shares")
      .populate("resiver");

    if (!user) {
      return res.status(405).json({ message: "Логин или пароль не правильны" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(405).json({ message: "Логин или пароль не правильны" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });

    res.status(200).json({ token, user });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Ошибка сервера, повторите попытку позже" });
  }
}

export async function Register(req, res) {
  try {
    const { email, firstName, lastName } = req.body;

    if (!email || !req.body.password || !firstName || !lastName) {
      return res.status(400).json({
        message: "Не все поля заполнены",
      });
    }

    const isUnique = await User.findOne({ email });

    if (isUnique) {
      return res.status(400).json({
        message: "Пользователь с таким email уже существует",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    const doc = new User({ email, firstName, lastName, password: hash });
    const user = await doc.save();


    if (!fs.existsSync(`files/${user._id}`)) {
      fs.mkdirSync(`files/${user._id}`);
      
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
