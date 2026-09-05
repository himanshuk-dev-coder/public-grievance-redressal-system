import z from "zod";

/* ================= LOGIN ================= */

export const loginUserSchema = z.object({
  email: z.string()
    .email({ message: "Please enter a valid email address" })
    .max(100, { message: "Email must not exceed 100 characters" }),

  password: z.string().trim()
    .min(6, { message: "Password must have at least 6 characters" })
    .max(100, { message: "Password must not exceed 100 characters" })
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.enum(["citizen", "officer", "admin"]).default("citizen")
});

/* ================= REGISTER ================= */

export const registerUserSchema = loginUserSchema.extend({
  name: z.string().trim()
    .min(3, { message: "Name must have at least 3 characters" })
    .max(100, { message: "Name must not exceed 100 characters" }),

  confirmPassword: z.string().trim()
    .min(6, { message: "Confirm password must have at least 6 characters" })
    .max(100, { message: "Confirm password must not exceed 100 characters" })
    }).refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"]
    });

/* ================= PASSWORD SCHEMAS ================= */

const passwordSchema = z.object({
  newPassword: z.string()
    .min(6, { message: "New password must be at least 6 characters" })
    .max(100, { message: "New password must not exceed 100 characters" }),

  confirmPassword: z.string()
    .min(6, { message: "Confirm password must be at least 6 characters" })
    .max(100, { message: "Confirm password must not exceed 100 characters" })
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export const verifyEmailSchema = z.object({
  token: z.string().trim().length(8),
  email: z.email()
});

export const nameSchema = z.object({
  name: z.string().trim()
   .min(3, {message: "Name must have atleast 3 characters"})
   .max(100, {message: "Name must have not more than 100 characters"}),
});

export const emailSchema = z
.email({message: "Please Enter a Valid Email Address"})
.max(100, {message: "Email must be not more than 100 characters"});

export const forgotPasswordSchema = z.object({
  email: emailSchema
})

export const verifyPasswordSchema = z.object({
  currentPassword: z.string()
    .min(6, { message: "Current password is required" })
    .max(100),

  newPassword: z.string()
    .min(6, { message: "New password must be at least 6 characters" })
    .max(100),

  confirmPassword: z.string()
    .min(6, { message: "Confirm password must be at least 6 characters" })
    .max(100),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const verifyResetPasswordSchema = passwordSchema;
export const setPasswordSchema = passwordSchema;

/* ================= VALIDATOR MIDDLEWARE ================= */

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.format(),
    });
  }

  req.body = result.data; // sanitized data
  next();
};
