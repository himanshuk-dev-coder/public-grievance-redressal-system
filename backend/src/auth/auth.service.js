import argon2 from "argon2";
import crypto from "crypto";
import path from "path";
import jwt from "jsonwebtoken";
import { User } from "../users/user.model.js";
import { OAuthAccount, ResetPasswordToken, Session } from "./auth.model.js";
import {rolePermissions} from "../constants/rolePermissions.js"
import { ACCESS_TOKEN_EXPIRY, MILLISECONDS_PER_SECOND, REFRESH_TOKEN_EXPIRY } from "../config/constants.js";
import { VerifyEmailToken } from "./auth.model.js";
import {sendEmail} from "../lib/send-email.js";
import ejs from "ejs";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import mjml2html from "mjml";
import mongoose from "mongoose"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




export const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const getUserByRole = async ({role}) => {
  return await User.findOne({ role });
};

export const countUserByRole = async ({role}) => {
  return await User.countDocuments({ role });
};

// Updating the User Name while Editing the Profile
export const updateUserByName = async ({ userId, name }) => {
  return await User.findByIdAndUpdate(
    userId,
    { name },
    { new: true, runValidators: true }
  );
};


export const insertUser = async ({ name, email, password, role }) => {
  const user = await User.create({ name, email, password, role });
  return user;
};

// Using argon2 Hashing Algorithms
export const hashPassword = async (password) => {
  return await argon2.hash(password);
};

export const comparePassword = async (password, hash) => {
  return await argon2.verify(hash, String(password));
};

/* IMPORTANT OBSERVATION **
 Generating a JWT Token 
 Later we got to know that JWT is more Prone to Hacker's Attack and 
 User's data can be stolen or misused
*/


// Generating a JWT Token 
export const generateToken = ({ id, name, email }) => {
  return jwt.sign(
    { id, name, email },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};



export const createSession = async (userId, { ip, userAgent, refreshTokenHash }) => {
  const session = await Session.create({
    userId,
    ip,
    userAgent,
    refreshTokenHash
  });

  return session;
};


// Verifying the JWT Token
export const verifyJWTToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/* IMPORTANT NOTE **
  We are Implementing Hybrid Authentication (Session + JWT) 
  with the help of Access Token and Refresh Token
*/

// @param {Object} payload - {id, name, email, role, sessionId, permissions}

export const createAccessToken =  ({id, name, email, role, sessionId, permissions}) => {
  if (!id || !role || !permissions) {
    throw new Error("Access Token creation failed: missing required fields");
  }
  return  jwt.sign({id, name, email, role, sessionId, permissions}, process.env.ACCESS_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: ACCESS_TOKEN_EXPIRY / MILLISECONDS_PER_SECOND  // "900 Minutes"
  });
}

export const createRefreshToken = (sessionId, role) => {
  return jwt.sign( {sessionId, role} , process.env.REFRESH_TOKEN_SECRET, {
    algorithm:"HS256",
    expiresIn: REFRESH_TOKEN_EXPIRY / MILLISECONDS_PER_SECOND  // "7 Days or 1 Week" 
  })
}


// Checking whether the sessionId is correct or not, 
// Matching it with the sessions Document in the Database
export const findSessionById = async (sessionId) => {
  const session = await Session.findById(sessionId);

  return session; // sessions Document ka poora data
}


// Once we get the currentSession, find the User's Data with the help of
// userId (Foreign Key in sessionsTable)
export const findUserById = async (userId) => {
  const user = await User.findById(userId);

  return user; // users Document ka poora data
}

/*  LOGIC
  Refreshing the Access Token means In case of Absence of AccessToken OR 
  IF AccessToken has expired or stolen,
  This function generates a NEW Access Token & Refresh Token 
*/


export const refreshTokens = async (refreshToken) => {
  // If RefreshToken is present, check if it's Valid or Not
  try {
  // "await" lagana bhool gaya tha 
    const decodedToken =  verifyJWTToken(refreshToken);  // sessionId
  //  console.log("Decoded Token : ",decodedToken);
    const currentSession = await findSessionById(decodedToken.sessionId); 
  //  console.log("Current Session : ",currentSession);
    /* If we do not get currentSession or valid = false ,
      Means the sessionId does not match with the sessionId of Database 
    */
    if(!currentSession || !currentSession.valid) {
      throw new Error("Invalid Session");
    }

    // If everything is FINE & OK
    const user = await findUserById(currentSession.userId);
  //  console.log("User : ",user);
    // If UserId of sessionsTable does not match with the id of usersTable , 
    // then the User is Not Present 
    if(!user) throw new Error("Invalid User");

    const userInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      // We will see this later while Email Verification
      isEmailValid: user.isEmailValid,
      sessionId: currentSession.id
    }
    //  console.log("User Info : ",userInfo);

    // Creating a New AccessToken and RefreshToken
    const newAccessToken =  createAccessToken(userInfo);
    const newRefreshToken = createRefreshToken(currentSession.id);
  //  console.log("New Access Token : ",newAccessToken);
  //  console.log("New Refresh Token : ",newRefreshToken);
    return {
      newAccessToken, newRefreshToken: refreshToken, user: userInfo
    };

  } catch (error) {
    console.log(error.message);
    throw error;
  }
}


// When User LogOut then we clear their created Session
export const clearUserSession = async (sessionId) => {
  return await Session.findByIdAndDelete(sessionId);
};

// Implementing DRY PRINCIPLE

/* LOGIC **
  This function performs tasks like 
  1. Creating a Session for a Specific User
  2. Generating Access Token & Refresh Token
  3. Setting the Access Token & Refresh Token as Cookies
*/

export const authenticateUser = async ({ req, res, user, role, name, email, permissions }) => {
  // We will use Hybrid Authentication (Session + JWT). Now we need to create a Session
  const session = await createSession(user.id, {
    ip: req.clientIp,
    userAgent: req.headers["user-agent"], //  It will be sent by the Browser By Default
  });

  // 2️⃣ Get permissions from role constants
    const permissionsFromRole = rolePermissions[role || user.role] || [];

  // Generating Access Token & Refresh Token
  const accessToken = createAccessToken({
    id: user.id, // user --> {id}
    name: user.name || name, // user => only id we are getting
    email: user.email || email,
    role: user.role || role,
    permissions: permissionsFromRole,
    // We will see this later while Email Verification
    isEmailValid: false,
    sessionId: session.id,

  });

  const refreshToken = createRefreshToken(session.id);

  // Access Token & Refresh Token are stored on the Client's Browser. Used to Prevent XSS Attack
  // Can only used by Secure HTTPS Request not just by Simple JavaScript
  const baseConfig = { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: "lax", 
    path: "/"   // ⭐ IMPORTANT 
  };
  
  res.cookie("access_token", accessToken, {
    ...baseConfig,
    maxAge: ACCESS_TOKEN_EXPIRY,
  });

  res.cookie("refresh_token", refreshToken, {
    ...baseConfig,
    maxAge: REFRESH_TOKEN_EXPIRY,
  });
  
  // ✅ THIS WAS THE MISSING PIECE
  // return res.status(200).json({
  //   success: true,
  //   message: "Authentication successful",
  //   accessToken,
  //   refreshToken,
  //   user: {
  //     id: user._id?.toString(),
  //     name: user.name ?? name,
  //     email: user.email ?? email,
  //     role: user.role ?? role
  //   }
  // });
};



// Generating a Random Token using Crypto Module
export const generateRandomToken = (digit = 8) => {
  const min = 10 ** (digit - 1); // 100000000
  const max = 10 ** digit; // 100000000

  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);

  // Generate number between 0 and 99999999
  const number = randomBuffer[0] % max;

  // Pad with leading zeros to ensure 8 digits
  return number.toString().padStart(8, "0");
};

// "04283716"


export const sendNewVerifyEmailLink = async ({ userId, email }) => {
  const randomToken = generateRandomToken();
  console.log("Random Token :", randomToken);

  await insertVerifyEmailToken({ userId, token: randomToken });

  const verifyEmailLink = createVerifyEmailLink({
    email,
    token: randomToken,
  });

  // ✅ Correct way to resolve path in ESM
  const mjmlFilePath = path.join(
    __dirname,
    "..",
    "emails",
    "verify-email.mjml"
  );

  const mjmlTemplate = await fs.readFile(mjmlFilePath, "utf-8");

  // Replace placeholders
  const filledTemplate = ejs.render(mjmlTemplate, {
    code: randomToken,
    link: verifyEmailLink,
  });

  // Convert MJML → HTML
  const htmlOutput = mjml2html(filledTemplate).html;

  // Send email
  await sendEmail({
    to: email,
    subject: "Verify your Email",
    html: htmlOutput,
  });
};


export const insertVerifyEmailToken = async ({ userId, token }) => {
  try {
    if (!userId || !token) {
      throw new Error("userId or token missing");
    }

    // 🔥 OPTIONAL BUT BEST PRACTICE
    await VerifyEmailToken.deleteMany({ userId });

    const verifyToken = await VerifyEmailToken.create({
      userId,
      token,
    });

    if (!verifyToken) {
      throw new Error("Token creation failed");
    }

    return verifyToken;
  } catch (error) {
    console.error("insertVerifyEmailToken error:", error.message);
    throw new Error("Unable to create Verification Token");
  }
};



export const createVerifyEmailLink = ({ email, token }) => {
  // In-built JS function
  // const uriEncodedEmail = encodeURIComponent(email);

  // return `${process.env.FRONTEND_URL}/verify-email-token?token=${token}&email=${uriEncodedEmail}`;

  const url = new URL(`${process.env.FRONTEND_URL}/verify-email-token`);

  url.searchParams.append("token", token);
  url.searchParams.append("email", email);

  return url.toString();
};


export const clearVerifyEmailTokens = async (email, userId) => {
  try {
    const result = await VerifyEmailToken.deleteMany({ userId: userId });
    // or deleteOne if you only expect 1 token per user
    // const result = await verifyEmailTokensCollection.deleteOne({ userId: userId });

    return result; // contains info like { acknowledged: true, deletedCount: 1 }
  } catch (err) {
    console.error("Error clearing verify email tokens:", err);
    throw err;
  }
};


export const findVerificationEmailToken = async ({ token }) => {
  return await VerifyEmailToken.findOne({
    token,
    expiresAt: { $gte: new Date() }   // Not expired
  }).populate("userId", "email isEmailValid");
};


export const verifyUserEmailAndUpdate = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    { isEmailValid: true },
    { new: true }
  );
};

export const updateUserPassword = async ({ userId, newPassword }) => {
  const newHashPassword = await hashPassword(newPassword);

  return await User.findByIdAndUpdate(
    userId,
    { password: newHashPassword },
    { new: true } // optional: returns updated doc
  );
};


export const createResetPasswordLink = async ({ userId }) => {
  // 1. Generate random token
  const randomToken = crypto.randomBytes(32).toString("hex");

  // 2. Hash token
  const hashToken = crypto.createHash("sha256").update(randomToken).digest("hex");

  // 3. Delete old token (one active token per user)
  await ResetPasswordToken.deleteOne({ userId });

  // 4. Insert new token
  await ResetPasswordToken.create({
    userId,
    tokenHash: hashToken
  });

  // 5. Return frontend reset link
  return `${process.env.FRONTEND_URL}/reset-password/${randomToken}`;
};


export const getResetPasswordToken = async (token) => {
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");

  const data = await ResetPasswordToken.findOne({
    tokenHash: hashToken,
    expiresAt: { $gte: new Date() }
  });

  return data;
};


export const clearResetPasswordToken = async (userId) => {
  return await ResetPasswordToken.deleteOne({ userId });
};


export const getUserWithOAuthId = async ({ provider, email }) => {
  // Find user by email
  const user = await User.findOne({ email })
    .select("_id name email role isEmailValid picture")
    .lean();

  if (!user) return null;

  // Find OAuth account (LEFT JOIN equivalent)
  const oauthAccount = await OAuthAccount.findOne({
    userId: user._id,
    provider,
  }).lean();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    isEmailValid: user.isEmailValid,
    picture: user.picture || null,
    provider: oauthAccount?.provider || null,
    providerAccountId: oauthAccount?.providerAccountId || null,
    role: user.role,
    
  };
};


export const linkUserWithOAuth = async ({
  userId,
  provider,
  providerAccountId,
  avatarUrl,
}) => {
  // Insert OAuth account
  await OAuthAccount.create({
    userId,
    provider,
    providerAccountId,
  });

  // Update avatar only if it doesn't exist
  if (avatarUrl) {
    await User.updateOne(
      { _id: userId, picture: { $exists: false } },
      { $set: { picture: avatarUrl } }
    );
  }
};


export const createUserWithOAuth = async ({
  name,
  email,
  provider,
  providerAccountId,
  avatarUrl,
}) => {
  let user;
  
  try {
    // ✅ Step 1: Pehle existing OAuthAccount check karo
    const existingOAuth = await OAuthAccount.findOne({ providerAccountId });

    if (existingOAuth) {
      // OAuthAccount exist karta hai → User dhoondo
      user = await User.findById(existingOAuth.userId).lean();
      if (user) {
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          isEmailValid: user.isEmailValid,
          role: user.role,
        };
      }
    }

    // ✅ Step 2: Existing user by email check karo
    user = await User.findOne({ email });

    if (user) {
      // User hai but OAuthAccount nahi → banao
      await OAuthAccount.create({
        userId: user._id,
        provider,
        providerAccountId,
        role: user.role,
      });

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailValid: user.isEmailValid,
        role: user.role,
      };
    }

    // ✅ Step 3: Bilkul naya user banao
    user = await User.create({
      name,
      email,
      googleId: providerAccountId,
      picture: avatarUrl,
      isEmailValid: true,
    });

    await OAuthAccount.create({
      userId: user._id,
      provider,
      providerAccountId,
      role: user.role,
    });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      isEmailValid: true,
      role: user.role,
    };

  } catch (error) {
    // ✅ Cleanup — sirf tabhi delete karo jab naya user bana ho
    if (user?._id) {
      await User.findByIdAndDelete(user._id).catch(() => {});
    }
    throw error;
  }
};
