import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useAddCategory } from "@/hooks/category/useCategory";
import { useState } from "react";

export default function AddCategoryModal({ open, onClose }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { mutate: addCategory, isLoading } = useAddCategory();
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    if (data.image?.[0]) formData.append("file", data.image[0]);

    addCategory(formData, {
      onSuccess: () => {
        reset();
        setPreview(null);
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Category Name</Label>
            <Input {...register("name", { required: true })} />
            {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
          </div>

          <div>
            <Label>Description</Label>
            <Input {...register("description")} />
          </div>

          <div>
            <Label>Image</Label>
            <Input type="file" accept="image/*" {...register("image")} onChange={handleImageChange} />
            {preview && <img src={preview} alt="Preview" className="mt-2 h-20 rounded-md" />}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
