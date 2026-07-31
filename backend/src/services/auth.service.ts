import bcrypt from "bcrypt";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { generateToken } from "../utils/generateToken";
import { loginInput, RegisterInput } from "../validators/auth.validator";

export const registerUser = async (input: RegisterInput) => {
  const { name, email, phone, password, confirmPassword } = input;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
  };
};

export const loginUser = async (input: loginInput) => {
  const { email, password } = input;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new ApiError(400, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, existingUser.password);

  if (!isMatch) {
    throw new ApiError(400, "Invalid credentials");
  }

  const token = generateToken(existingUser._id.toString());

  return {
    id: existingUser._id,
    name: existingUser.name,
    email: existingUser.email,
    phone: existingUser.phone,
    token,
  };
};
