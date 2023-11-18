const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    type: req.body.type,
    phone: req.body.phone,
  });
  const hashedPassword = CryptoJS.AES.decrypt(
    newUser.password,
    process.env.PASS_SEC
  );
  const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
  try {
    newUser.password = await bcrypt.hash(originalPassword, 10);
    console.log(newUser);
    try {
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (err) {
      res.status(500).json({ msg: "Lỗi máy chủ", code: 3 });
    }
  } catch {
    res.status(500).json({ msg: "Lỗi máy chủ", code: 3 });
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(404).json({ msg: "Nguời dùng không tồn tại", code: 1 });
    }
    if (!user.isAdmin) {
      return res
        .status(401)
        .json({
          msg: "Bạn không phải là Admin vui lòng rời khỏi đây",
          code: 2,
        });
    }
    const hashedPassword = CryptoJS.AES.decrypt(
      req.body.password,
      process.env.PASS_SEC
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    try {
      const checkPassword = await bcrypt.compare(
        originalPassword,
        user.password
      );
      if (!checkPassword) {
        return res
          .status(401)
          .json({ msg: "Sai mật khẩu hoặc tài khoản", code: 2 });
      }

      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SEC,
        { expiresIn: "3d" }
      );

      const { password, ...others } = user._doc;

      res.status(200).json({ ...others, accessToken });
    } catch (err) {
      res.status(500).json({ msg: "Lỗi máy chủ", code: 3 });
    }
  } catch {
    res.status(500).json({ msg: "Lỗi máy chủ", code: 3 });
  }
});

router.post("/loginUser", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(404).json({ msg: "Nguời dùng không tồn tại", code: 1 });
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      req.body.password,
      process.env.PASS_SEC
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    try {
      const checkPassword = await bcrypt.compare(
        originalPassword,
        user.password
      );
      if (!checkPassword) {
        return res
          .status(401)
          .json({ msg: "Sai mật khẩu hoặc tài khoản", code: 2 });
      }
      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SEC,
        { expiresIn: "3d" }
      );

      const { password, ...others } = user._doc;

      res.status(200).json({ ...others, accessToken });
    } catch (err) {
      res.status(500).json({ msg: "Lỗi máy chủ", code: 3 });
    }
  } catch (error) {
    res.status(500).json({ msg: "Lỗi máy chủ", code: 3 });
  }
});

module.exports = router;
