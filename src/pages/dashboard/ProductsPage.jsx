import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ProductTable from "@/components/product/ProductTable";
import VariantTable from "@/components/product/VariantTable";

export default function ProductsPage() {
  const [tab, setTab] = useState("products");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const storedProductId = localStorage.getItem("variantViewProductId");
    if (storedProductId) {
      setTab("variants");
      setSelectedProductId(storedProductId);
      localStorage.removeItem("variantViewProductId");
    }
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-primary">Product Management</h1>
        <Button onClick={() => navigate("/add-product")}>
          {tab === "products" ? "Add Product" : "Add Variant"}
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(value) => {
        setTab(value);
        if (value === "products") {
          setSelectedProductId(null);
        }
      }}>
        <TabsList className="mb-4 bg-gray-300">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductTable
            onViewVariants={(productId) => {
              localStorage.setItem("variantViewProductId", productId);
              setTab("variants");
              setSelectedProductId(productId);
            }}
          />
        </TabsContent>

        <TabsContent value="variants">
          <VariantTable preselectedProductId={selectedProductId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
