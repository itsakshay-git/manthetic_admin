import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { useUpdateOrderStatus } from '@/hooks/orders/useOrders';
import UpdateStatusModal from './UpdateStatusModal';
import { toast } from 'sonner';

export default function OrderTable({ orders = [], onUpdate }) {
  const { updateOrderStatus, isUpdating } = useUpdateOrderStatus();
  const [openDialogId, setOpenDialogId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleUpdate = (orderId) => (data) => {
    updateOrderStatus(
      { id: orderId, ...data },
      {
        onSuccess: () => {
          toast.success(`Order #${orderId} updated`);
          setOpenDialogId(null);
        },
        onError: () => {
          toast.error(`Failed to update order #${orderId}`);
        },
      }
    );
  };

  return (
    <div className="border rounded-2xl shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="p-4">Order ID</TableHead>
            <TableHead className="p-4">Customer</TableHead>
            <TableHead className="p-4">Items</TableHead>
            <TableHead className="p-4">Status</TableHead>
            <TableHead className="p-4">Payment</TableHead>
            <TableHead className="p-4 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedOrders.map((order, i) => (
            <TableRow
              key={order.id}
              className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <TableCell className="p-4 font-mono text-xs text-gray-700">
                #{order.id}
              </TableCell>
              <TableCell className="p-4 text-gray-800">
                {order.customer_name}
              </TableCell>
              <TableCell className="p-4">
                <div className="space-y-1 text-muted-foreground text-xs">
                  {order.items.map((item) => (
                    <div key={item.id}>
                      {item.product_name} × {item.quantity} – ₹{item.price}
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell className="p-4">
                <Badge
                  className={
                    order.status === 'DELIVERED'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'CANCELLED'
                      ? 'bg-red-100 text-red-800'
                      : order.status === 'SHIPPED'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'CONFIRMED'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="p-4">
                <Badge
                  className={
                    order.payment_status === 'PAID'
                      ? 'bg-emerald-100 text-emerald-800'
                      : order.payment_status === 'FAILED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-gray-100 text-gray-800'
                  }
                >
                  {order.payment_status}
                </Badge>
              </TableCell>
              <TableCell className="p-4 text-center">
                <Dialog
                  open={openDialogId === order.id}
                  onOpenChange={(open) =>
                    setOpenDialogId(open ? order.id : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      Update
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Update Order #{order.id}</DialogTitle>
                    </DialogHeader>
                    <UpdateStatusModal
                      onSubmit={handleUpdate(order.id)}
                      isLoading={isUpdating}
                      defaultStatus={order.status}
                      defaultPaymentStatus={order.payment_status}
                    />
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50">
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
