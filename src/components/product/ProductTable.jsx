import React, { useState, useMemo } from "react";
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
import { useNavigate } from "react-router-dom";
import SearchInput from "@/components/shared/SearchInput";

export default function ProductTable({ onViewVariants }) {
  const [categoryId, setCategoryId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);

  const { mutate: deleteProduct, isPending: deleting } = useDeleteProduct();
  const { data: categories = [], isLoading: loadingCategories } = useGetAllCategories();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate()


  const {
    data,
    isLoading: loadingProducts,
  } = useGetAllProducts({ page: currentPage, limit: 10, category: categoryId });

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase().trim();
    return products.filter(product =>
      product.title?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      categories.find(c => c.id === product.category_id)?.name?.toLowerCase().includes(query)
    );
  }, [products, searchQuery, categories]);

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

  // Reset to first page when search or filter changes
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (val) => {
    setCategoryId(val);
    setCurrentPage(1);
    setSearchQuery(""); // Clear search when category changes
  };

  console.log(filteredProducts)

  return (
    <div>
      <div className="pb-4 space-y-4">
        {/* Search and Filter Row */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex-1 w-full sm:max-w-md">
            <SearchInput
              placeholder="Search products by name, description, or category..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Select value={categoryId} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-60">
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

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      </div>
      <div className="border rounded-2xl shadow-sm overflow-hidden">
        {/* Mobile View - Card Layout */}
        <div className="block sm:hidden">
          {filteredProducts.map((prod, i) => (
            <div
              key={prod.id}
              className={`p-4 border-b last:border-b-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
            >
              <div className="flex items-start space-x-3">
                <img
                  src={prod.imageUrl}
                  className="h-16 w-16 rounded object-cover border flex-shrink-0"
                  alt="Product"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{prod.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {truncateText(prod.description, 60)}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {categories.find((c) => c.id === prod.categoryId)?.name || "Unknown"}
                    </span>
                    <Badge
                      className={
                        prod.status === "ACTIVE"
                          ? "bg-green-100 text-green-800 text-xs"
                          : prod.status === "INACTIVE"
                            ? "bg-gray-100 text-gray-800 text-xs"
                            : "bg-yellow-100 text-yellow-800 text-xs"
                      }
                    >
                      {prod.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => onViewVariants(prod.id)}
                      className="text-xs p-0 h-auto"
                    >
                      View Variants
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/add-variant/${prod.id}`)}
                      className="text-xs px-2 py-1 h-auto"
                    >
                      Add Variant
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditProduct(prod)}
                      className="text-xs px-2 py-1 h-auto"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setDeleteProductId(prod.id)}
                      className="text-xs px-2 py-1 h-auto"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View - Table Layout */}
        <div className="hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Image</TableHead>
                <TableHead className="text-left">Title</TableHead>
                <TableHead className="text-left max-w-[250px]">Description</TableHead>
                <TableHead className="text-left">Category</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Variants</TableHead>
                <TableHead className="text-center">Add Variant</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((prod, i) => (
                <TableRow
                  key={prod.id}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell className="text-center">
                    <img
                      src={prod.imageUrl}
                      className="h-12 w-12 mx-auto rounded object-cover border"
                      alt="Product"
                    />
                  </TableCell>
                  <TableCell className="align-middle">{prod.title}</TableCell>
                  <TableCell className="max-w-[250px] truncate align-middle">
                    {truncateText(prod.description)}
                  </TableCell>
                  <TableCell className="align-middle">
                    {categories.find((c) => c.id === prod.categoryId)?.name || "Unknown"}
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/add-variant/${prod.id}`)}
                    >
                      Add
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
        </div>

        {/* Show message when no results found */}
        {filteredProducts.length === 0 && !loadingProducts && (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? (
              <div>
                <p className="text-lg font-medium mb-2">No products found</p>
                <p className="text-sm">Try adjusting your search terms or category filter</p>
              </div>
            ) : (
              <p className="text-lg">No products available</p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 border-t bg-gray-50 space-y-3 sm:space-y-0">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex space-x-2">
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
