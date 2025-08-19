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
      size_options: [{ size: "", stock: "", price: "" }],
      images: null,
      is_best_selling: false,
    },
  });

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { isSubmitting },
  } = form;

  const sizeOptions = watch("size_options");

  const handleSizeChange = (index, field, value) => {
    const updated = [...sizeOptions];
    updated[index][field] = value;
    setValue("size_options", updated);
  };

  const handleAddSize = () => {
    setValue("size_options", [
      ...sizeOptions,
      { size: "", stock: "", price: "" },
    ]);
  };

  const handleRemoveSize = (index) => {
    const updated = sizeOptions.filter((_, i) => i !== index);
    setValue("size_options", updated);
  };



  const onSubmit = async (data) => {
    console.log("Form submitted:", data);
    try {
      const formData = new FormData();
      formData.append("product_id", productId);
      formData.append("name", data.name || "");
      formData.append("description", data.description || "");
      formData.append("size_options", JSON.stringify(data.size_options));
      formData.append("is_best_selling", data.is_best_selling ? "true" : "false");

      if (data.images?.[0]) {
        formData.append("images", data.images[0]);
      }

      const variant = await addVariant(formData);

      toast.success("Variant added successfully!");
      reset();
      setImagePreview(null);
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
        className="grid gap-4 lg:gap-6 border rounded-xl p-4 lg:p-6 shadow-md bg-white"
      >
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm lg:text-base">Variant Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Variant name (e.g. T-shirt Red L)"
                  {...field}
                  className="text-sm lg:text-base"
                />
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
              <FormLabel className="text-sm lg:text-base">Variant Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Short variant description"
                  rows={3}
                  {...field}
                  className="text-sm lg:text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3 lg:space-y-4">
          <FormLabel className="text-sm lg:text-base">Sizes (with Stock & Price)</FormLabel>
          {sizeOptions.map((option, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3 items-center mb-3 lg:mb-2"
            >
              <Input
                value={option.size}
                onChange={(e) => handleSizeChange(index, "size", e.target.value)}
                placeholder="Size (e.g. M)"
                className="text-sm lg:text-base"
              />
              <Input
                type="number"
                value={option.stock}
                onChange={(e) => handleSizeChange(index, "stock", e.target.value)}
                placeholder="Stock"
                className="text-sm lg:text-base"
              />
              <Input
                type="number"
                value={option.price}
                onChange={(e) => handleSizeChange(index, "price", e.target.value)}
                placeholder="Price (₹)"
                className="text-sm lg:text-base"
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleRemoveSize(index)}
                className="text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-2 h-8 lg:h-9"
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddSize}
            className="w-full sm:w-auto text-sm lg:text-base"
          >
            Add Size
          </Button>
        </div>

        <FormField
          control={control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm lg:text-base">Variant Image</FormLabel>
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
                    className="text-sm lg:text-base"
                  />
                  {imagePreview && (
                    <div className="mt-3 lg:mt-2 relative w-24 h-24 lg:w-32 lg:h-32 mx-auto lg:mx-0">
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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full lg:w-auto text-sm lg:text-base"
        >
          {isSubmitting ? "Adding..." : "Add Variant"}
        </Button>
      </form>
    </Form>
  );
};

export default VariantForm;
