import { object, string } from "zod"

export const signupSchema = object({
  email: string({ required_error: "Please fill in this field." })
    .min(1, "Please fill in this field.")
    .email("Please enter a valid email address."),
  password: string({ required_error: "Please fill in this field." })
    .min(1, "Please fill in this field.")
    .min(8, "Password must be more than 8 characters.")
    .max(32, "Password must be less than 32 characters."),
})

export const loginSchema = object({
  email: string({ required_error: "Please fill in this field." })
    .min(1, "Please fill in this field."),
  password: string({ required_error: "Please fill in this field." })
    .min(1, "Please fill in this field.")
})