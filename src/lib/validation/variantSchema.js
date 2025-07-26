import { z } from "zod";

export const singleVariantSchema = z.object({
  name: z.string().min(1, "Name is required"),              
  description: z.string().min(1, "Description is required"),
  size: z.string().min(1, "Size is required"),
  price: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), { message: "Price must be a number" }),
  stock: z
    .string()
    .refine((val) => !isNaN(parseInt(val)), { message: "Stock must be a number" }),
  is_best_selling: z.boolean().optional(),
  images: z
    .any()
    .refine((files) => files && files.length > 0, {
      message: "At least one image is required",
    }),
});
