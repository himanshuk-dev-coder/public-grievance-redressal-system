// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

// export const hashPassword = (password) => {
//   const salt = bcrypt.genSalt();
//   bcrypt.hash(password, salt)
// }

// export const comparePassword = (password, hash) => bcrypt.compare(password, hash);

// export const generateAccessToken = (user) =>
//   jwt.sign(
//     { id: user._id, role: user.role },
//     process.env.JWT_ACCESS_SECRET,
//     { expiresIn: "15m" }
//   );

// export const generateRefreshToken = (user) =>
//   jwt.sign(
//     { id: user._id },
//     process.env.JWT_REFRESH_SECRET,
//     { expiresIn: "7d" }
//   );
