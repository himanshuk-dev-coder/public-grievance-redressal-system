import { Google } from "arctic";
import { env } from "../../config/env.js";

export const google = new Google(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URI
    // http://localhost:4500/google/callback
    // We will create this route to verify after LogIn
);