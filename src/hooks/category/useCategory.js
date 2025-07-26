import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { toast } from "sonner";

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
      const res = await axios.post("/categories/admin/categories", formData);
      return res.data;
    },
    onSuccess: (newCategory) => {
      toast.success("Category added");
      queryClient.invalidateQueries(["categories"]);
    },
    onError: () => {
      toast.error("Failed to add category");
    },
  });
};
