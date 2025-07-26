import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "@/components/product/ProductForm";
import VariantForm from "@/components/product/VariantForm";
import { Separator } from "@/components/ui/separator";

export default function AddProduct() {
  const [createdProductId, setCreatedProductId] = useState(() => {
    return localStorage.getItem("createdProductId") || null;
  });

  const navigate = useNavigate();

  const handleProductCreated = (productId) => {
    setCreatedProductId(productId);
    localStorage.setItem("createdProductId", productId);
  };

  const handleFinish = () => {
    setCreatedProductId(null);
    localStorage.removeItem("createdProductId");
    navigate("/admin/products");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h2 className="text-2xl font-semibold">
        {createdProductId ? "Add Product Variants" : "Create New Product"}
      </h2>

      {!createdProductId ? (
        <ProductForm onProductCreated={handleProductCreated} />
      ) : (
        <>
          <VariantForm productId={createdProductId} onFinish={handleFinish} />
          <Separator className="my-6" />
        </>
      )}
    </div>
  );
}
