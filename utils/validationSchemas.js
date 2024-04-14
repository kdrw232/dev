const z = require("zod");

// Register Schema
const registerSchema = z.object({
  email: z.string().min(9).max(100).email(),
  full_name: z.string().min(2).max(40),
  password: z.string().min(8),
});


const editProfileSchema = z.object({
  email: z.string().min(9).max(100).email(),
  full_name: z.string().min(2).max(40),
  password: z.string().min(8),
});

const LoginSchema = z.object({
  email: z.string().min(9).max(100).email(),
  password: z.string().min(8),
});
const resetPasswordSchema = z.object({
  password: z.string().min(8),
});
module.exports = {
  registerSchema,
  editProfileSchema,
  LoginSchema,
  resetPasswordSchema
};
