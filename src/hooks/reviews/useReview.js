import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

export const useGetAllReviews = () => {
  return useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const res = await axios.get("/reviews/admin/all");
      return res.data;
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/reviews/admin/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-reviews"]);
    },
  });
};
