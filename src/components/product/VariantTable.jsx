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

export default function VariantTable({ preselectedProductId }) {
  const [productId, setProductId] = useState("all");
  const [editVariant, setEditVariant] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 10;

  const { getVariantsByProduct, getAllVariants } = useVariant();
  const { data: products = [] } = useGetAllProducts();

  const {
    data: allVariants = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["variants", productId || "all"],
    queryFn: () =>
      productId && productId !== "all"
        ? getVariantsByProduct(productId)
        : getAllVariants(),
  });


  useEffect(() => {
    setPage(1);
    if (preselectedProductId) {
      setProductId(preselectedProductId);
    } else {
      setProductId("all");
    }
  }, [preselectedProductId]);

  const paginatedVariants = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return allVariants?.slice(start, end);
  }, [allVariants, page]);

  const totalPages = Math.ceil(allVariants?.length / limit);

return (
  <div>
      <div className="pb-4 flex justify-between items-center">
        <Select value={productId} onValueChange={setProductId}>
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
    <div className="border rounded-2xl shadow-sm overflow-hidden">
      {isLoading ? (
        <div className="p-4 text-muted-foreground">Loading variants...</div>
      ) : isError ? (
        <div className="p-4 text-red-500">Failed to load variants</div>
      ) : allVariants.length === 0 ? (
        <div className="p-4 text-muted-foreground">No variants found</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVariants.map((v, i) => (
                <TableRow
                  key={v.id}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell>
                    <img
                      src={v.images?.[0]}
                      alt="Variant"
                      className="h-12 w-12 rounded border object-cover"
                    />
                  </TableCell>
                  <TableCell>{v.name}</TableCell>
                  <TableCell>{v.size}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        v.stock > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {v.stock}
                    </Badge>
                  </TableCell>
                  <TableCell>${v.price}</TableCell>
                  <TableCell>
                    {products.find((p) => p.id === v.product_id)?.title || "-"}
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
              ))}
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
