import React from "react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function UpdateStatusModal({
  onSubmit,
  isLoading,
  defaultStatus,
  defaultPaymentStatus,
}) {
  const { handleSubmit, setValue, watch, register } = useForm({
    defaultValues: {
      status: defaultStatus || "",
      payment_status: defaultPaymentStatus || "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-6 relative ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 rounded-md">
          <Loader2 className="animate-spin w-6 h-6 text-gray-700" />
        </div>
      )}

      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          onValueChange={(val) => setValue("status", val)}
          value={watch("status") || ""}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">PENDING</SelectItem>
            <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
            <SelectItem value="SHIPPED">SHIPPED</SelectItem>
            <SelectItem value="DELIVERED">DELIVERED</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Payment Status</Label>
        <Select
          onValueChange={(val) => setValue("payment_status", val)}
          value={watch("payment_status") || ""}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select payment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">PENDING</SelectItem>
            <SelectItem value="PAID">PAID</SelectItem>
            <SelectItem value="FAILED">FAILED</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update"}
      </Button>
    </form>
  );
}
