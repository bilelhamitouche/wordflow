import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";

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
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      } else {
        try {
          await prisma.user.create({
            data: {
              username,
              email,
              password: hashedPassword
            }
          })
          res.status(201).json({ message: "Account created successfully" })
        } catch (err) {
          return next(err);
        }
      }
    });
  },
];

async function login(req, res) {

}

export { register };
