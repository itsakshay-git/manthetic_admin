import { useEffect, useState, useMemo } from "react";
import EditVariantModal from "./EditVariantModal";
import { useVariant } from "@/hooks/product/useVariant";
import { useGetAllProducts } from "@/hooks/product/useProduct";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import SearchInput from "@/components/shared/SearchInput";

export default function VariantTable({ preselectedProductId }) {
  const [productId, setProductId] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editVariant, setEditVariant] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { getVariantsByProduct, getAllVariants } = useVariant();
  const { data: productData } = useGetAllProducts({
    page: 1,
    limit: 100,
    category: "",
  });

  const products = productData?.products || [];

  const {
    data: allVariants = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["variants", productId],
    queryFn: () =>
      productId !== "all" ? getVariantsByProduct(productId) : getAllVariants(),
  });

  useEffect(() => {
    setPage(1);
    setProductId(preselectedProductId || "all");
    setSearchQuery(""); // Clear search when product changes
  }, [preselectedProductId]);

  // Filter variants based on search query
  const filteredVariants = useMemo(() => {
    if (!searchQuery.trim()) return allVariants;

    const query = searchQuery.toLowerCase().trim();
    return allVariants.filter(variant => {
      const variantName = variant.name?.toLowerCase() || "";
      const productTitle = products.find(p => p.id === variant.product_id)?.title?.toLowerCase() || "";

      return variantName.includes(query) || productTitle.includes(query);
    });
  }, [allVariants, searchQuery, products]);

  const paginatedVariants = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredVariants?.slice(start, end);
  }, [filteredVariants, page]);



  const totalPages = Math.ceil((filteredVariants?.length || 0) / limit);

  // Reset to first page when search changes
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  // Reset to first page when product filter changes
  const handleProductChange = (value) => {
    setProductId(value);
    setPage(1);
    setSearchQuery(""); // Clear search when product changes
  };

  return (
    <div>
      <div className="pb-4 space-y-4">
        {/* Search and Filter Row */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex-1 max-w-md">
            <SearchInput
              placeholder="Search variants by name or product..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Select value={productId} onValueChange={handleProductChange}>
            <SelectTrigger className="w-60">
              <SelectValue placeholder="Filter by product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing {filteredVariants.length} of {allVariants.length} variants
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      </div>

      <div className="border rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-muted-foreground">Loading variants...</div>
        ) : isError ? (
          <div className="p-4 text-red-500">Failed to load variants</div>
        ) : filteredVariants.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? (
              <div>
                <p className="text-lg font-medium mb-2">No variants found</p>
                <p className="text-sm">Try adjusting your search terms or product filter</p>
              </div>
            ) : (
              <p className="text-lg">No variants available</p>
            )}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Best Selling</TableHead>
                  <TableHead>Sizes</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedVariants.map((v, i) => {
                  const productTitle =
                    products.find((p) => p.id === v.productId)?.title || "-";
                  const isExpanded = expandedId === v.id;

                  return (
                    <>
                      <TableRow key={v.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <TableCell>
                          <img
                            src={v.images?.[0]}
                            alt="Variant"
                            className="h-12 w-12 rounded border object-cover"
                          />
                        </TableCell>
                        <TableCell>{v.name}</TableCell>
                        <TableCell>{productTitle}</TableCell>
                        <TableCell>
                          {v.isBestSelling ? (
                            <Badge className="bg-green-100 text-green-800">Yes</Badge>
                          ) : (
                            <Badge variant="secondary">No</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-sm px-0 flex items-center gap-1"
                            onClick={() => setExpandedId(isExpanded ? null : v.id)}
                          >
                            {isExpanded ? (
                              <>
                                Hide Sizes <ChevronUp className="w-4 h-4" />
                              </>
                            ) : (
                              <>
                                View Sizes <ChevronDown className="w-4 h-4" />
                              </>
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3"
                            onClick={() => setEditVariant(v)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>

                      {isExpanded && (
                        <TableRow className="bg-gray-50">
                          <TableCell colSpan={6} className="p-4">
                            {v.sizeOptions?.length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full text-xs border">
                                  <thead className="bg-gray-200 text-gray-600">
                                    <tr>
                                      <th className="px-3 py-2 border">Size</th>
                                      <th className="px-3 py-2 border">Price</th>
                                      <th className="px-3 py-2 border">Stock</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {v.sizeOptions.map((opt, idx) => (
                                      <tr key={idx}>
                                        <td className="px-3 py-2 border">{opt.size}</td>
                                        <td className="px-3 py-2 border">₹{opt.price}</td>
                                        <td className="px-3 py-2 border">{opt.stock}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-sm italic text-muted-foreground">
                                No size options available.
                              </p>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>

            <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50">
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}

        {editVariant && (
          <EditVariantModal
            variant={editVariant}
            open={!!editVariant}
            onClose={() => setEditVariant(null)}
          />
        )}
      </div>
    </div>
  );
}
