import { useState } from "react";
import ProductForm from "@/components/products/ProductForm";
import VariantForm from "@/components/products/VariantForm";

export default function AddProductPage() {
  const [createdProduct, setCreatedProduct] = useState(null);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Add New Product</h2>

      <ProductForm onProductCreated={setCreatedProduct} />

      {createdProduct && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold">Add Variants</h3>
          <VariantForm productId={createdProduct.id} />
        </div>
      )}
    </div>
  );
}
