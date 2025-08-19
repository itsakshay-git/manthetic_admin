import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoryFormSchema } from "@/lib/validation/categorySchema";
import { useAddCategory } from "@/hooks/category/useCategory";
import { useState } from "react";
import { toast } from "sonner";

export default function AddCategoryModal({ open, onClose, onCategoryAdded }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
    trigger
  } = useForm({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      image: null
    }
  });

  const { mutate: addCategory, isLoading } = useAddCategory();
  const [preview, setPreview] = useState(null);

  const watchImage = watch("image");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("image", e.target.files);
      setPreview(URL.createObjectURL(file));
      trigger("image");
    }
  };

  const onSubmit = (data, event) => {
    // Prevent any form interference
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }

    addCategory(formData, {
      onSuccess: (newCategory) => {
        reset();
        setPreview(null);
        onClose();
        toast.success("Category added successfully!");

        // Call the callback to refresh categories in parent component
        if (onCategoryAdded && typeof onCategoryAdded === "function") {
          onCategoryAdded(newCategory);
        }
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Failed to add category");
      },
    });
  };

  const handleClose = () => {
    reset();
    setPreview(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg lg:text-xl font-semibold text-gray-900">
            Add New Category
          </DialogTitle>
        </DialogHeader>

        <form
          id="add-category-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 lg:space-y-6"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm lg:text-base font-medium">
              Category Name *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter category name"
              {...register("name")}
              className="text-sm lg:text-base"
            />
            {errors.name && (
              <p className="text-red-500 text-xs lg:text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm lg:text-base font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter category description (optional)"
              {...register("description")}
              rows={3}
              className="text-sm lg:text-base resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-xs lg:text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-sm lg:text-base font-medium">
              Category Image *
            </Label>
            <div className="space-y-3">
              <Input
                id="image"
                type="file"
                accept="image/*"
                {...register("image")}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                  }
                }}
                className="text-sm lg:text-base"
              />
              {preview && (
                <div className="flex justify-center lg:justify-start">
                  <div className="relative w-24 h-24 lg:w-32 lg:h-32">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => setPreview(null)}
                      className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow-lg hover:bg-gray-50"
                    >
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
            {errors.image && (
              <p className="text-red-500 text-xs lg:text-sm mt-1">
                {errors.image.message}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="w-full sm:w-auto text-sm lg:text-base"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto text-sm lg:text-base"
            >
              {isLoading ? "Adding..." : "Add Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
