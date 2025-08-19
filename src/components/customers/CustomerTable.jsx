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
import { formatDate } from "@/lib/utils";

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
      <div className="pb-4 space-y-4">
        {/* Search Input */}
        <div className="w-full max-w-md">
          <Input
            placeholder="Search customers by name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="max-w-sm"
          />
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing {filteredCustomers.length} of {customers.length} customers
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      </div>

      <div className="border rounded-2xl shadow-sm overflow-hidden">
        {/* Mobile View - Card Layout */}
        <div className="block sm:hidden">
          {filteredCustomers.map((cust, i) => (
            <div
              key={cust.id}
              className={`p-4 border-b last:border-b-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {cust.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{cust.name}</h3>
                      <p className="text-sm text-gray-500">{cust.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="group relative">
                      <Badge className="bg-gray-100 text-gray-800 cursor-help">
                        {formatDate(cust.createdAt, 'time')}
                      </Badge>
                      {/* Tooltip */}
                      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                        {formatDate(cust.createdAt, 'long')}
                        <div className="absolute top-full right-0 mr-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>ID: #{cust.id}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(cust.id)}
                    disabled={isDeleting}
                    className="text-xs px-2 py-1 h-auto"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
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
                <TableHead className="text-center">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((cust, i) => (
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
                    <div className="group relative">
                      <Badge className="bg-gray-100 text-gray-800 cursor-help">
                        {formatDate(cust.createdAt, 'time')}
                      </Badge>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                        {formatDate(cust.createdAt, 'long')}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(cust.id)}
                      disabled={isDeleting}
                      className="h-8 px-3"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Show message when no results found */}
        {filteredCustomers.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? (
              <div>
                <p className="text-lg font-medium mb-2">No customers found</p>
                <p className="text-sm">Try adjusting your search terms</p>
              </div>
            ) : (
              <p className="text-lg">No customers available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
