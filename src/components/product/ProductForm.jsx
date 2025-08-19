// components/product/ProductForm.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/lib/validation/productSchema";
import {
  useGetAllCategories,
  useAddCategory
} from "@/hooks/category/useCategory";
import { useAddProduct } from "@/hooks/product/useProduct";
import { toast } from "sonner";
import AddCategoryModal from "@/components/category/AddCategoryModal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function ProductForm({ onProductCreated }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);

  const { data: categories, isLoading: loadingCategories, refetch: refetchCategories } = useGetAllCategories();

  const {
    mutate: addProduct,
    isLoading: addingProduct,
  } = useAddProduct();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  const watchImage = watch("main_image");

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.name);
    formData.append("description", data.description);
    formData.append("category_id", data.category_id);
    formData.append("image", data.main_image[0]);

    addProduct(formData, {
      onSuccess: (product) => {
        toast.success("Product created successfully");
        reset();
        setImagePreview(null);
        if (onProductCreated && typeof onProductCreated === "function") {
          onProductCreated(product.id);
        } else {
          toast.error("onProductCreated is not defined or not a function");
        }
      },
      onError: (error) => {
        toast.error("Failed to create product");
        console.error("Product creation error:", error);
      },
    });
  };

  const handleCategoryAdded = () => {
    // Refresh the categories list when a new category is added
    refetchCategories();
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Add Category Button - Outside the form */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCategoryModalOpen(true)}
          className="w-full sm:w-auto"
        >
          + Add Category
        </Button>
      </div>

      {/* Product Form */}
      <form
        id="add-product-form"
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 lg:p-6 bg-white shadow-md rounded-md space-y-4 lg:space-y-6"
        noValidate
      >
        <h2 className="text-lg lg:text-xl font-semibold">Add Product</h2>

        {/* Product Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            {...register("name")}
            className="w-full border px-3 py-2 lg:py-2 rounded-md text-sm lg:text-base"
            placeholder="Enter product name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register("description")}
            className="w-full border px-3 py-2 lg:py-2 rounded-md text-sm lg:text-base resize-none"
            rows={3}
            placeholder="Enter product description"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Category Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Category</label>
          {errors.category_id && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category_id.message}
            </p>
          )}
          {loadingCategories ? (
            <p className="text-sm text-gray-500">Loading categories...</p>
          ) : (
            <div className="w-full">
              <Select
                onValueChange={(value) => {
                  setValue("category_id", value);
                  trigger("category_id");
                }}
                value={watch("category_id") || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Main Image */}
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Main Image</label>
          <input
            type="file"
            accept="image/*"
            {...register("main_image")}
            onChange={(e) =>
              setImagePreview(URL.createObjectURL(e.target.files[0]))
            }
            className="block w-full text-sm lg:text-base"
          />
          {errors.main_image && (
            <p className="text-red-500 text-sm mt-1">
              {errors.main_image.message}
            </p>
          )}
          {imagePreview && (
            <div className="flex justify-center lg:justify-start">
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-24 h-24 lg:w-32 lg:h-32 object-cover rounded-md border"
              />
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={addingProduct}
          className="w-full lg:w-auto px-4 py-2 lg:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm lg:text-base"
        >
          {addingProduct ? "Creating..." : "Create Product"}
        </Button>
      </form>

      {/* Category Modal - Outside the form */}
      <AddCategoryModal
        key={isCategoryModalOpen ? 'open' : 'closed'}
        open={isCategoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onCategoryAdded={handleCategoryAdded}
      />
    </div>
  );
}
