import jwt from "jsonwebtoken";
import {  refreshTokens, verifyJWTToken } from "../auth/auth.service.js";
import dotenv from "dotenv";
dotenv.config();
  
export const requireAuth = (req, res, next) => {
  // console.log("Cookies 👉 IN requireAuth : ", req.cookies);
  
  const { access_token } = req.cookies;
  if (!access_token) return res.status(401).json({ message: "Unauthorized" });
  
  try {
   
    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, { algorithms: "HS256"});
    
    req.user = {
      id: decoded.id,
      role: decoded.role,
      permissions: decoded.permissions
    };
    console.log("req.user :- ", req.user);
    next();
  } catch (err) {
    console.log(err.message);
    return res.status(401).json({ message: "Token expired or invalid" });
  }
};


/* IMPORTANT NOTE :- 
  You can Add any property to request but Keep in Mind these things :-
  1. Avoid Overwriting Existing Properties (e.g. request.body = null) 
  2. Use request.user for Authentication
  3. Keep the Data Lightweight
  4. If there are multiple data then Group Custom properties under
    request.custom if needed.
*/

/*
 Refreshing the Access Token
 In Case of Absence of Access Token
*/

export const verifyAuthentication = async (req, res, next) => {
  // Getting the AccessToken & RefreshToken 
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  req.user = null;

  // Both the AccessToken & RefreshToken has expired
  if(!accessToken && !refreshToken) {
    return next();
  }

  // If AccessToken is present, check if it's Valid or Not
  if(accessToken) {
    try {
      const decodedToken =  verifyJWTToken(accessToken);
      req.user = decodedToken; // {id, name, email}
      return next();
    } catch (error) {
      console.log("Invalid access token :- ",error.message);
      req.user = null;
    }
  }

  // If there is no accessToken but refreshToken is present
  // Means User has LoggedIn (User is in LoggedIn State) but accessToken had exprired
  if(refreshToken) {
    try {
      const {newAccessToken, newRefreshToken, user} = await refreshTokens(refreshToken);
      req.user = user;

      const baseConfig = { httpOnly: true, secure: true};
      
        res.cookie("access_token", newAccessToken, {
          ...baseConfig,
          maxAge: ACCESS_TOKEN_EXPIRY
        });
      
        res.cookie("refresh_token", newRefreshToken, {
          ...baseConfig,
          maxAge: REFRESH_TOKEN_EXPIRY
        });

      return next();

    } catch (error) {
      // access token expired → try refresh
      console.log(error.message);
    }
  }
  return next();
};


 