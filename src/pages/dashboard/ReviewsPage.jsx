import React from "react";
import { useGetAllReviews } from "@/hooks/reviews/useReview";
import ReviewTable from "@/components/review/ReviewTable";
import { Loader2 } from "lucide-react";

const ReviewsPage = () => {
  const { data: reviews, isLoading, isError } = useGetAllReviews();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Reviews</h1>
      <p className="text-muted-foreground mb-4">
        Monitor and manage all product reviews submitted by users.
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin h-6 w-6 text-gray-600" />
        </div>
      ) : isError ? (
        <div className="text-red-500 text-center">Failed to load reviews</div>
      ) : (
        <ReviewTable reviews={reviews} />
      )}
    </div>
  );
};

export default ReviewsPage;
