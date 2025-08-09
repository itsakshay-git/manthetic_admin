import React, { useState } from "react";
import { useGetAllProducts } from "@/hooks/product/useProduct";
import { useGetAllCategories } from "@/hooks/category/useCategory";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import EditProductModal from "./EditProductModal";
import { truncateText } from "@/lib/utils";
import { useDeleteProduct } from "@/hooks/product/useProduct";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ProductTable({ onViewVariants }) {
  const [categoryId, setCategoryId] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  
  const { mutate: deleteProduct, isPending: deleting } = useDeleteProduct();
  const { data: categories = [], isLoading: loadingCategories } = useGetAllCategories();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  
const {
  data,
  isLoading: loadingProducts,
} = useGetAllProducts({ page: currentPage, limit: 10, category: categoryId });

const products = data?.products || [];
const totalPages = data?.totalPages || 1;

  const handleDelete = async (id) => {
  try {
    await deleteProduct(id);
    toast.success("Product and its variants deleted successfully");
    setDeleteProductId(null);
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete product");
  }
};

return (
  <div>
      <div className="pb-4 flex justify-between items-center">
        <Select value={categoryId} onValueChange={(val) => {
          setCategoryId(val);
          setCurrentPage(1); // reset to first page on filter
        }}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    <div className="border rounded-2xl shadow-sm overflow-hidden">

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Image</TableHead>
            <TableHead className="text-left">Title</TableHead>
            <TableHead className="text-left max-w-[250px]">Description</TableHead>
            <TableHead className="text-left">Category</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Variants</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((prod, i) => (
            <TableRow
              key={prod.id}
              className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <TableCell className="text-center">
                <img
                  src={prod.imageurl}
                  className="h-12 w-12 mx-auto rounded object-cover border"
                  alt="Product"
                />
              </TableCell>
              <TableCell className="align-middle">{prod.title}</TableCell>
              <TableCell className="max-w-[250px] truncate align-middle">
                {truncateText(prod.description)}
              </TableCell>
              <TableCell className="align-middle">
                {categories.find((c) => c.id === prod.category_id)?.name || "Unknown"}
              </TableCell>
              <TableCell className="text-center align-middle">
                <Badge
                  className={
                    prod.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : prod.status === "INACTIVE"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {prod.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center align-middle">
                <Button variant="link" onClick={() => onViewVariants(prod.id)}>
                  View
                </Button>
              </TableCell>
              <TableCell className="text-center align-middle">
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => setEditProduct(prod)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => setDeleteProductId(prod.id)}
                  >
                    Delete
                  </Button>
                </div>
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


      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          open={!!editProduct}
        />
      )}
      <Dialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-lg font-semibold">Confirm Deletion</h2>
          </DialogHeader>
          <p>
            Are you sure you want to delete this product? This will also delete all its
            variants.
          </p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteProductId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(deleteProductId)}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </div>
);
}
