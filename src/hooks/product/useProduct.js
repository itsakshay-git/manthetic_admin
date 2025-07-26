import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";


export const useGetAllProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.get("/products/");
      console.log(data)
      return data;
    },
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
