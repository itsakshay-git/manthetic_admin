import { z } from "zod";

export const categorySchema = z.object({
    name: z
        .string()
        .min(2, "Category name must be at least 2 characters")
        .max(50, "Category name must be less than 50 characters")
        .trim(),
    description: z
        .string()
        .max(500, "Description must be less than 500 characters")
        .optional(),
    image: z
        .instanceof(FileList)
        .refine((files) => files.length > 0, "Image is required")
        .refine(
            (files) => files[0]?.type.startsWith("image/"),
            "File must be an image"
        )
        .refine(
            (files) => files[0]?.size <= 5 * 1024 * 1024, // 5MB
            "Image size must be less than 5MB"
        ),
});

export const categoryFormSchema = z.object({
    name: z
        .string()
        .min(2, "Category name must be at least 2 characters")
        .max(50, "Category name must be less than 50 characters")
        .trim(),
    description: z
        .string()
        .max(500, "Description must be less than 500 characters")
        .optional(),
    image: z
        .any()
        .refine((files) => files?.length > 0, "Image is required")
        .refine(
            (files) => files?.[0]?.type?.startsWith("image/"),
            "File must be an image"
        )
        .refine(
            (files) => files?.[0]?.size <= 5 * 1024 * 1024, // 5MB
            "Image size must be less than 5MB"
        ),
});
