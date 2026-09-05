import {Router} from "express";
import * as AuthControllers from "./auth.controller.js";
import { registerUserSchema, nameSchema, validate, verifyPasswordSchema, verifyResetPasswordSchema, forgotPasswordSchema} from "./auth.validator.js";
import { requireAuth } from "../middlewares/verify-auth-middleware.js";


const router = Router();
console.log("✅ auth.routes.js LOADED");

router.post('/login', AuthControllers.loginUser);

router.post('/signup', validate(registerUserSchema), AuthControllers.registerUser);

router.get('/profile', requireAuth , AuthControllers.profilePage);

router.post("/resend-verification-link", requireAuth ,AuthControllers.resendVerificationLink);

router.get("/verify-email/:token", AuthControllers.verifyEmailToken);

router.post('/logout', requireAuth, AuthControllers.logOutUser);

router.post("/refresh", AuthControllers.refreshToken);

router.post("/edit-profile", requireAuth, validate(nameSchema), AuthControllers.EditProfile);

router.post("/change-password", requireAuth, validate(verifyPasswordSchema), AuthControllers.ChangePassword);

router.post("/reset-password", validate(forgotPasswordSchema), AuthControllers.ResetPassword);

router.post("/reset-password/:token", validate(verifyResetPasswordSchema), AuthControllers.ResetPasswordToken);

router.get("/google", AuthControllers.getGoogleLoginPage);
router.route("/google/callback").get(AuthControllers.getGoogleLoginCallback);





export const authRoutes =  router;