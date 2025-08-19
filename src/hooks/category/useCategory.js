import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get("/categories/");
      return res.data;
    },
  });
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post("/categories/admin/categories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: (newCategory) => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Failed to add category";
      console.error("Category creation error:", errorMessage);
    },
  });
};
