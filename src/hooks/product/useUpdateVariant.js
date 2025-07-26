import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { toast } from 'sonner';

export const useUpdateVariant = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return axios.put(`/variants/admin/variants/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      toast.success('Variant updated successfully');
      queryClient.invalidateQueries(['variants']);
    },
    onError: () => {
      toast.error('Failed to update variant');
    },
  });

  return mutation;
};

