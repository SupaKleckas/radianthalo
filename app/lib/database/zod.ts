import { number, object, string, z } from "zod"

export const signupSchema = object({
  email: string({ required_error: "Please fill in this field." })
    .min(1, "Please fill in this field.")
    .email("Please enter a valid email address."),
  password: string({ required_error: "Please fill in this field." })
    .min(1, "Please fill in this field.")
    .min(8, "Password must be more than 8 characters.")
    .max(32, "Password must be less than 32 characters."),
  firstName: string({ required_error: "Please fill in this field." })
    .min(1, "Please fill in this field."),
  lastName: string({ required_error: "Please fill in this field." })
    .min(1, "Please fill in this field.")
})

export const loginSchema = object({
  email: string({ required_error: "Please fill in this field." })
    .min(1, "Please fill in this field."),
  password: string({ required_error: "Please fill in this field." })
    .min(1, "Please fill in this field.")
})

export const addUserSchema = object({
  email: string({ required_error: "Please fill in this field." })
    .min(1, "Please fill in this field.")
    .email("Please enter a valid email address."),
  password: string({ required_error: "Please fill in this field." })
    .min(1, "Please fill in this field.")
    .min(8, "Password must be more than 8 characters.")
    .max(32, "Password must be less than 32 characters."),
  firstName: string({ required_error: "Please fill in this field." })
    .min(1, "Please fill in this field."),
  lastName: string({ required_error: "Please fill in this field." })
    .min(1, "Please fill in this field."),
  role: z.enum(['ADMIN', 'USER', 'EMPLOYEE'], { required_error: "Please fill in this field." })
});

export const editUserSchema = object({
  id: string({ required_error: 'No ID found.' })
    .min(1),
  email: string({ required_error: "Please fill in this field." })
    .min(1, "Please fill in this field.")
    .email("Please enter a valid email address."),
  firstName: string({ required_error: "Please fill in this field." })
    .min(1, "Please fill in this field."),
  lastName: string({ required_error: "Please fill in this field." })
    .min(1, "Please fill in this field."),
  role: z.enum(['ADMIN', 'USER', 'EMPLOYEE'], { required_error: "Please fill in this field." })
});

export const addServiceSchema = object({
  title: string({ required_error: "Please fill in this field." })
    .min(1, "Please fill in this field."),
  price: number({ required_error: "Please fill in this field." })
    .min(0, "Price must be greater than 0.")
    .int("Please set price as a whole number."),
  duration: number({ required_error: "Please fill in this field." })
    .min(0, "Duration must be greater than 0.")
    .int("Duration must be an integer (minutes)."),
});

export const editServiceSchema = object({
  id: string({ required_error: 'No ID found.' })
    .min(1),
  title: string({ required_error: "Please fill in this field." })
    .min(1, "Please fill in this field."),
  price: number({ required_error: "Please fill in this field." })
    .min(0, "Price must be greater than 0."),
  duration: number({ required_error: "Please fill in this field." })
    .min(0, "Price must be greater than 0.")
    .int("Duration must be an integer (minutes)."),
});

export const addReviewSchema = object({
  rating: number({ required_error: "Please fill in this field." })
    .min(1, "Please fill in this field."),
  content: string()
    .max(500, "Provide up to 500 symbols only."),
});

export const editPasswordSchema = object({
  newPassword: string({ required_error: "Please fill in this field." })
    .min(8, "Password must be at least 8 characters long.")
    .min(8, "Password must be more than 8 characters.")
    .max(32, "Password must be less than 32 characters."),
  confirmPassword: string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export const editAccountSchema = object({
  email: string({ required_error: "Please fill in this field." })
    .min(1, "Please fill in this field.")
    .email("Please enter a valid email address."),
  firstName: string({ required_error: "Please fill in this field." })
    .min(1, "Please fill in this field."),
  lastName: string({ required_error: "Please fill in this field." })
    .min(1, "Please fill in this field."),
});