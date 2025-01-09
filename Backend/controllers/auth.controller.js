import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
export async function signup(req, res) {
  try {
    const { email, password, username, phone, isAdmin } = req.body;

    if (!email || !password || !username || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const existingUserByPhone = await User.findOne({ phone });
    if (existingUserByPhone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number already exists" });
    }

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const PROFILE_PICS = [
      "https://res.cloudinary.com/duucxuyvk/image/upload/v1736410636/videos/images/profile-1.png",
      "https://res.cloudinary.com/duucxuyvk/image/upload/v1736410636/videos/images/profile-2.jpg",
      "https://res.cloudinary.com/duucxuyvk/image/upload/v1736410635/videos/images/profile-3.jpg",
      "https://res.cloudinary.com/duucxuyvk/image/upload/v1736410635/videos/images/profile-4.jpg",
      "https://res.cloudinary.com/duucxuyvk/image/upload/v1736410635/videos/images/profile-5.jpg",
      "https://res.cloudinary.com/duucxuyvk/image/upload/v1736411824/videos/images/profile-6.jpg",
    ];
    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      phone,
      image,
      isAdmin: isAdmin || false,
    });

    generateTokenAndSetCookie(newUser._id, res);
    await newUser.save();

    res.status(201).json({
      success: true,
      user: {
        ...newUser._doc,
        password: "",
      },
    });
  } catch (error) {
    console.error("Error in signup controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("jwt-netflix");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function authCheck(req, res) {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        image: req.user.image,
        email: req.user.email,
        isAdmin: req.user.isAdmin, // החזר את המידע אם המשתמש הוא אדמין
      },
    });
  } catch (error) {
    console.log("Error in authCheck controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
async function sendResetEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "ofekve1003@gmail.com", // עדכן את כתובת האימייל
      pass: "cjub bewr joun cnrg", // עדכן את הסיסמה
    },
  });

  const resetLink = `http://localhost:5173/reset-password?token=${token}`;

  const mailOptions = {
    from: "CinemaTech",
    to: email,
    subject: "Password Reset Request",
    html: `<p>To reset your password, click the link below:</p><a href="${resetLink}">Reset Password</a>`,
  };

  await transporter.sendMail(mailOptions);
}

// פונקציה לשליחת בקשת איפוס סיסמה
export async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // יצירת טוקן ייחודי לאיפוס
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 3600000; // שעה אחת

    await user.save();

    // שליחת המייל
    await sendResetEmail(email, resetToken);

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Error in requestPasswordReset", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// פונקציה לאיפוס סיסמה בפועל
export async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetPassword", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
