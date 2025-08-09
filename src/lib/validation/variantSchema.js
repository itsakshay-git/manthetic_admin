import { z } from "zod";

export const singleVariantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  size_options: z
    .array(
      z.object({
        size: z.string().min(1, "Size is required"),
        stock: z.string().min(1, "Stock is required"),
        price: z.string().min(1, "Price is required"),
      })
    )
    .min(1, "At least one size is required"),
  is_best_selling: z.boolean().optional(),
  images: z
    .any()
    .refine((files) => files && files.length > 0, {
      message: "At least one image is required",
    }),
});
