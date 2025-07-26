import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useCallback } from "react";

export const useVariant = () => {
  const queryClient = useQueryClient();
  
  const { mutateAsync: addVariant } = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post("/variants/admin/variants", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.variant;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["variants"]);
    },
    onError: (error) => {
      console.error("Failed to add variant:", error);
    },
  });

    const getAllVariants = useCallback(async () => {
    const response = await axios.get("/variants/product/variants");
    console.log(response.data)
    return response.data;
  }, []);

  
    const getVariantsByProduct = useCallback(async (productId) => {
        const response = await axios.get(`/products/${productId}`);
        return response.data.variants;
    }, []);

  return {
    addVariant,
    getVariantsByProduct,
    getAllVariants,
  };
};
