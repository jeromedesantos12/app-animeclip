import Joi from "joi";

export const loginSchema = Joi.object({
  emailOrUsername: Joi.string().required().messages({
    "string.empty": "Email or Username is required.",
    "any.required": "Email or Username is required.",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required.",
    "any.required": "Password is required.",
  }),
});

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email must be text",
    "string.email": "Email is invalid",
    "string.empty": "Email cannot be empty",
    "any.required": "Email is required",
  }),
  username: Joi.string().min(3).max(30).required().messages({
    "string.base": "Username must be text",
    "string.empty": "Username cannot be empty",
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username must be at most 30 characters",
    "any.required": "Username is required",
  }),
  fullname: Joi.string().min(3).max(100).required().messages({
    "string.base": "Fullname must be text",
    "string.empty": "Fullname cannot be empty",
    "string.min": "Fullname must be at least 3 characters",
    "string.max": "Fullname must be at most 100 characters",
    "any.required": "Fullname is required",
  }),
  password: Joi.string().min(6).max(100).required().messages({
    "string.base": "Password must be text",
    "string.empty": "Password cannot be empty",
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
});

export const resetSchema = Joi.object({
  password: Joi.string().required().messages({
    "string.empty": "Old Password is required.",
    "any.required": "Old Password is a required field.",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "New Password must be at least 6 characters.",
    "string.empty": "New Password is required.",
    "any.required": "New Password is a required field.",
  }),
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email().optional(),
  username: Joi.string().min(3).max(30).optional(),
  fullname: Joi.string().min(3).max(100).optional(),
  password: Joi.string().min(6).max(100).optional(),
  bio: Joi.string().max(500).allow(null, "").optional(),
  headline: Joi.string().max(255).allow(null, "").optional(),
  remove_avatar: Joi.string().optional(),
  remove_banner: Joi.string().optional(),
  avatar_url: Joi.any().optional(),
  banner_url: Joi.any().optional(),
});
