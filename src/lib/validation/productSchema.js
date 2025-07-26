import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name must be under 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description too long"),
  category_id: z.string().min(1, "Category is required"),
  main_image: z
    .any()
    .refine((files) => files?.length === 1, {
      message: "Main image is required",
    }),
});
