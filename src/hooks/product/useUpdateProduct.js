import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { toast } from 'sonner';

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category_id', data.category_id);
      formData.append('status', data.status || 'ACTIVE');
      
      if (data.image instanceof File) {
        formData.append('image', data.image);
      }

      return axios.put(`/admin/products/${id}`, formData);
    },
    onSuccess: (res) => {
      toast.success('Product updated successfully');
      queryClient.invalidateQueries(['products']);
    },
    onError: () => {
      toast.error('Failed to update product');
    }
  });

  return mutation;
};
