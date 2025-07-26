import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";


const fetchOrders = async () => {
  const res = await axios.get("/order/admin/orders");
  return res.data;
};

const updateOrder = async ({ id, status, payment_status }) => {
    const res = await axios.put(`/order/admin/order/${id}`, { status, payment_status });
    console.log(res)
  return res.data;
};

export const useOrders = () => {
  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  return {
    orders,
    isLoading,
    isError,
  };
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    updateOrderStatus: mutate,
    isUpdating: isLoading,
  };
};
