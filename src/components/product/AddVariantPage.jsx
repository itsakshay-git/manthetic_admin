import { useParams, useNavigate } from "react-router-dom";
import VariantForm from "@/components/product/VariantForm";

export default function AddVariantPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Add Variant</h2>
      <VariantForm 
        productId={productId} 
        onFinish={() => navigate("/products")} 
      />
    </div>
  );
}
