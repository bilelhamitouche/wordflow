import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prismaClient.js";

const alphanumericError = "should only contain letters and digits";
const emailError = "should be a valid email address";
const lengthError = "should be at least 8 characters";

const validateUser = [
  body("username")
    .trim()
    .isAlphanumeric()
    .withMessage(`username ${alphanumericError}`),
  body("email").trim().isEmail().withMessage(`email ${emailError}`),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage(`password ${lengthError}`),
];

const register = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      } else {
        try {
          await prisma.user.create({
            data: {
              username,
              email,
              password: hashedPassword,
            },
          });
          res.status(201).json({ message: "Account created successfully" });
        } catch (err) {
          return next(err);
        }
      }
    });
  },
];

async function login(req, res) {
  const { username, email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
        email,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "Invalid username or email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}

export { register, login };
