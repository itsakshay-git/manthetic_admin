import { useState, useMemo } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { toast } from "react-hot-toast";
import { useDeleteReview } from "@/hooks/reviews/useReview";
import { formatDate } from "@/lib/utils";

export default function ReviewTable({ reviews = [] }) {
  const { mutate: deleteReview, isLoading: isDeleting } = useDeleteReview();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialogId, setOpenDialogId] = useState(null);
  const itemsPerPage = 5;

  const filteredReviews = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return reviews.filter(
      (r) =>
        r.user_name.toLowerCase().includes(q) ||
        r.product_name.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q)
    );
  }, [searchQuery, reviews]);

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id) => {
    deleteReview(id, {
      onSuccess: () => {
        toast.success(`Review #${id} deleted`);
        setOpenDialogId(null);
      },
      onError: () => {
        toast.error(`Failed to delete review #${id}`);
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="px-2 pt-2">
        <Input
          placeholder="Search by user, product, or comment..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="border rounded-2xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="p-4">User</TableHead>
              <TableHead className="p-4">Product</TableHead>
              <TableHead className="p-4">Rating</TableHead>
              <TableHead className="p-4">Comment</TableHead>
              <TableHead className="p-4">Created</TableHead>
              <TableHead className="p-4 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedReviews.map((review, i) => (
              <TableRow
                key={review.id}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <TableCell className="p-4">{review.user_name}</TableCell>
                <TableCell className="p-4">{review.product_name}</TableCell>
                <TableCell className="p-4">{review.rating}</TableCell>
                <TableCell className="p-4">{review.comment}</TableCell>
                <TableCell className="p-4">
                  <div className="group relative">
                    <Badge className="bg-gray-100 text-gray-800 cursor-help">
                      {formatDate(review.createdAt, 'time')}
                    </Badge>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      {formatDate(review.createdAt, 'long')}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="p-4 text-center">
                  <Dialog
                    open={openDialogId === review.id}
                    onOpenChange={(open) =>
                      setOpenDialogId(open ? review.id : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-black hover:text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm">
                      <DialogHeader>
                        <DialogTitle>
                          Delete Review #{review.id}?
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                          Are you sure you want to delete this review? This
                          action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setOpenDialogId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(review.id)}
                            disabled={isDeleting}
                          >
                            Confirm Delete
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
            {paginatedReviews.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-sm text-gray-500"
                >
                  No reviews found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages || 1}
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
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
