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
import { useUpdateVariant } from '@/hooks/product/useUpdateVariant';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { Textarea } from '../ui/textarea';

const EditVariantModal = ({ open, onClose, variant }) => {
  const [formData, setFormData] = useState({
    size_options: [{ size: '', stock: '', price: '' }],
    is_best_selling: false,
    name: '',
    description: '',
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const { mutateAsync: updateVariant } = useUpdateVariant();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (variant) {
      setFormData({
        size_options: variant.size_options || [{ size: '', stock: '', price: '' }],
        is_best_selling: variant.is_best_selling || false,
        name: variant.name || '',
        description: variant.description || '',
        images: [],
      });

      setExistingImages(Array.isArray(variant.images) ? variant.images : []);
      setImagePreviews([]);
    }
  }, [variant]);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (files) {
      const fileArray = Array.from(files);
      const previewUrls = fileArray.map((file) => URL.createObjectURL(file));

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...fileArray],
      }));
      setImagePreviews((prev) => [...prev, ...previewUrls]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSizeOptionChange = (index, field, value) => {
    const updatedSizes = [...formData.size_options];
    updatedSizes[index][field] = value;
    setFormData((prev) => ({ ...prev, size_options: updatedSizes }));
  };

  const addSizeOption = () => {
    setFormData((prev) => ({
      ...prev,
      size_options: [...prev.size_options, { size: '', stock: '', price: '' }],
    }));
  };

  const removeSizeOption = (index) => {
    const updated = [...formData.size_options];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, size_options: updated }));
  };

  const removeNewImage = (index) => {
    const updatedImages = [...formData.images];
    const updatedPreviews = [...imagePreviews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setFormData((prev) => ({ ...prev, images: updatedImages }));
    setImagePreviews(updatedPreviews);
  };

  const removeExistingImage = (index) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append('size_options', JSON.stringify(formData.size_options));
    data.append('is_best_selling', formData.is_best_selling ? 'true' : 'false');
    data.append('name', formData.name || '');
    data.append('description', formData.description || '');
    data.append('existingImages', JSON.stringify(existingImages));

    formData.images.forEach((img) => {
      data.append('images', img);
    });

    try {
      setIsSubmitting(true);
      await updateVariant({ id: variant.id, data });
      onClose();
    } catch (err) {
      toast.error('Failed to update variant.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Variant</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 space-y-2">
              <Label>Size Options</Label>
              {formData.size_options.map((opt, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={opt.size}
                    onChange={(e) => handleSizeOptionChange(index, 'size', e.target.value)}
                    placeholder="Size"
                    required
                  />
                  <Input
                    type="number"
                    value={opt.stock}
                    onChange={(e) => handleSizeOptionChange(index, 'stock', e.target.value)}
                    placeholder="Stock"
                    required
                  />
                  <Input
                    type="number"
                    value={opt.price}
                    onChange={(e) => handleSizeOptionChange(index, 'price', e.target.value)}
                    placeholder="Price"
                    required
                  />
                  <Button type="button" onClick={() => removeSizeOption(index)} variant="destructive">
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addSizeOption} variant="outline">
                + Add Size Option
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
            </div>

            <div className="col-span-2 flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_best_selling"
                checked={formData.is_best_selling}
                onChange={handleChange}
                id="bestSelling"
              />
              <Label htmlFor="bestSelling">Best Selling</Label>
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="images">Upload Images</Label>
              <Input
                id="images"
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleChange}
              />

              {existingImages.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-2">
                  {existingImages.map((img, index) => (
                    <div key={index} className="relative w-24 h-24 border rounded overflow-hidden">
                      <img src={img} alt="existing" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-[2px] shadow-md hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-2">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden">
                      <img src={src} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-[2px] shadow-md hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2">
            {isSubmitting && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
              </svg>
            )}
            {isSubmitting ? 'Updating...' : 'Update Variant'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditVariantModal;