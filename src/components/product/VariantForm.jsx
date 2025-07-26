import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { singleVariantSchema } from "@/lib/validation/variantSchema";
import { useVariant } from "@/hooks/product/useVariant";
import { toast } from "sonner";
import { UploadIcon, Trash2 } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const VariantForm = ({ productId, onFinish }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const { addVariant } = useVariant();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(singleVariantSchema),
    defaultValues: {
    name: "",
    description: "",
    size: "",
    price: "",
    stock: "",
    images: null,
    is_best_selling: false,
    },
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = form;

const onSubmit = async (data) => {
  console.log(data)
  try {
    const formData = new FormData();
    formData.append("product_id", productId);
    formData.append("name", data.name || "");
    formData.append("description", data.description || "");
    formData.append("size", data.size || "");
    formData.append("price", data.price || "");
    formData.append("stock", data.stock || "");
    formData.append("is_best_selling", data.is_best_selling ? "true" : "false");

    if (data.images?.[0]) {
      formData.append("images", data.images[0]);
    }

    const variant = await addVariant(formData);

    toast.success("Variant added successfully!");
    reset();
    setImagePreview(null);
    // onVariantCreated?.(variant?.id);
      if (onFinish) {
        onFinish();
      }
    navigate("/products");
  } catch (error) {
    console.error("Variant creation error:", error);
    toast.error("Failed to add variant.");
  }
};


  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 border rounded-xl p-6 shadow-md bg-white"
      >
        <FormField
        control={control}
        name="name"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Variant Name</FormLabel>
            <FormControl>
                <Input placeholder="Variant name (e.g. T-shirt Red L)" {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />

        <FormField
        control={control}
        name="description"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Variant Description</FormLabel>
            <FormControl>
                <Textarea
                placeholder="Short variant description"
                rows={3}
                {...field}
                />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        <FormField
          control={control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Size</FormLabel>
              <FormControl>
                <Input placeholder="e.g. M, L, XL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (₹)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 999" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variant Image</FormLabel>
              <FormControl>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImagePreview(URL.createObjectURL(file));
                        field.onChange(e.target.files);
                      }
                    }}
                  />
                  {imagePreview && (
                    <div className="mt-2 relative w-32 h-32">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="rounded-lg border w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          field.onChange(null);
                        }}
                        className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Variant"}
        </Button>
      </form>
    </Form>
  );
};

export default VariantForm;
