import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";


export const useGetAllProducts = ({ page = 1, limit = 10, category = "" }) =>
  useQuery({
    queryKey: ["products", page, limit, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (category && category !== "all") {
        params.append("category", category);
      }

      const { data } = await axios.get(`/products/?${params.toString()}`);
      return data; // includes: products, totalPages, totalCount, page
    },
    keepPreviousData: true, // keeps previous page while loading new
  });


export const useAddProduct = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post("/products/admin/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data.product;
    },
  });
};


export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }) => {
      const res = await axios.put(`/products/admin/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data.product;
    },
    onSuccess: (data) => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries(["products"]);
    },
    onError: () => {
      toast.error("Failed to update product");
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      console.log(id)
      const res = await axios.delete(`products/admin/products/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });
};
