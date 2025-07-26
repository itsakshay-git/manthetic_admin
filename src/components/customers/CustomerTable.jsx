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
import { toast } from "sonner";

export default function CustomerTable({ customers = [], onDelete, isDeleting }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialogId, setOpenDialogId] = useState(null);
  const itemsPerPage = 5;

  // Filter customers based on search query
  const filteredCustomers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return customers.filter(
      (cust) =>
        cust.name.toLowerCase().includes(q) ||
        cust.email.toLowerCase().includes(q) ||
        cust.id.toString().includes(q)
    );
  }, [searchQuery, customers]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id) => {
    onDelete(id, {
      onSuccess: () => {
        toast.success(`Customer #${id} deleted`);
        setOpenDialogId(null);
      },
      onError: () => {
        toast.error(`Failed to delete customer #${id}`);
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="px-2 pt-2">
        <Input
          placeholder="Search by name, email or ID..."
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
              <TableHead className="p-4">Customer ID</TableHead>
              <TableHead className="p-4">Name</TableHead>
              <TableHead className="p-4">Email</TableHead>
              <TableHead className="p-4">Created At</TableHead>
              <TableHead className="p-4 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCustomers.map((cust, i) => (
              <TableRow
                key={cust.id}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <TableCell className="p-4 font-mono text-xs text-gray-700">
                  #{cust.id}
                </TableCell>
                <TableCell className="p-4">{cust.name}</TableCell>
                <TableCell className="p-4">{cust.email}</TableCell>
                <TableCell className="p-4">
                  <Badge className="bg-gray-100 text-gray-800">
                    {new Date(cust.created_at).toLocaleDateString()}
                  </Badge>
                </TableCell>
                <TableCell className="p-4 text-center">
                  <Dialog
                    open={openDialogId === cust.id}
                    onOpenChange={(open) =>
                      setOpenDialogId(open ? cust.id : null)
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
                          Delete Customer #{cust.id}?
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                          Are you sure you want to delete this customer? This
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
                            onClick={() => handleDelete(cust.id)}
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

            {paginatedCustomers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-sm text-gray-500">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
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
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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
