import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useUpdateProduct } from '@/hooks/product/useProduct';
import { useGetAllCategories } from '@/hooks/category/useCategory';
import { X } from 'lucide-react';

const EditProductModal = ({ open, onClose, product }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    image: null,
    imageurl: '',
  });

  const { mutate: updateProduct, isPending: isLoading } = useUpdateProduct();
  const { data: categories = [] } = useGetAllCategories();

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        category_id: product.category_id || '',
        image: null,
        imageurl: product.imageurl || '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
        imageurl: URL.createObjectURL(files[0]),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageClear = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      imageurl: '',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitFormData = new FormData();
    submitFormData.append('title', formData.title);
    submitFormData.append('description', formData.description);
    submitFormData.append('category_id', formData.category_id);
    submitFormData.append('status', 'ACTIVE');
    if (formData.image) {
      submitFormData.append('image', formData.image);
    } else {
      submitFormData.append('imageurl', formData.imageurl);
    }

    updateProduct(
      { id: product.id, formData: submitFormData },
      {
        onSuccess: () => {
          toast.success('Product updated successfully');
          onClose();
        },
        onError: () => {
          toast.error('Failed to update product');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">Select Category</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Product Image</Label>
            <Input type="file" name="image" onChange={handleChange} />
            {formData.imageurl && (
              <div className="relative w-32 h-32 mt-2">
                <img
                  src={formData.imageurl}
                  alt="preview"
                  className="w-full h-full object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={handleImageClear}
                  className="absolute top-0 right-0 bg-white rounded-full p-1 shadow"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Updating...' : 'Update Product'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
