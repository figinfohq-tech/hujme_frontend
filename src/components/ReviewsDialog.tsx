import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Star, ThumbsUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { baseURL } from "@/utils/constant/url";

/* ================= TYPES ================= */

interface ReviewItem {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string | Date;
  helpfulCount: number;
}

interface ReviewsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  packageName: string;
  agentName: string;
  agentId: string;
}

/* ================= COMPONENT ================= */

export const ReviewsDialog = ({
  isOpen,
  onClose,
  packageName,
  agentName,
  agentId,
}: ReviewsDialogProps) => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH REVIEWS ================= */

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      const res = await axios.get(
        `${baseURL}customer-reviews/byAgent/${agentId}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        },
      );

      const formatted: ReviewItem[] = Array.isArray(res.data)
        ? res.data.map((item: any) => ({
            id: item.reviewId?.toString(),
            userName: item.customerName || "Anonymous",
            rating: item.rating,
            comment: item.reviewText,
            date: item.postedAt,
            helpfulCount: item.helpfulVotes ?? 0,
          }))
        : [];

      setReviews(formatted);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !agentId) return;
    fetchReviews();
  }, [isOpen, agentId]);

  /* ================= CALCULATIONS ================= */

  const averageRating = useMemo(() => {
    if (!reviews.length) return "0.0";
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return avg.toFixed(1);
  }, [reviews]);

  const distribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => dist[r.rating]++);
    return dist;
  }, [reviews]);

  const handleHelpfulVote = async (reviewId: string) => {
    try {
      const token = sessionStorage.getItem("token");

      // ✅ Optimistic UI update
      // setReviews((prev) =>
      //   prev.map((r) =>
      //     r.id === reviewId
      //       ? { ...r, helpfulCount: r.helpfulCount + 1 }
      //       : r
      //   )
      // );

      const response = await axios.patch(
        `${baseURL}customer-reviews/helpful-votes/${reviewId}`,
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        },
      );
      fetchReviews();
    } catch (error) {
      console.error("Failed to update helpful vote", error);

      // ❌ rollback if failed
      // setReviews((prev) =>
      //   prev.map((r) =>
      //     r.id === reviewId
      //       ? { ...r, helpfulCount: r.helpfulCount - 1 }
      //       : r
      //   )
      // );
    }
  };

  /* ================= UI ================= */

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto z-[9999]">
        <DialogHeader>
          <DialogTitle className="text-xl">{agentName}</DialogTitle>
          {/* <p className="text-sm text-muted-foreground">by {agentName}</p> */}
        </DialogHeader>

        {/* ===== Rating Summary ===== */}
        <div className="flex gap-6 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">
              {averageRating}
            </div>

            <div className="flex justify-center gap-0.5 my-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= Math.round(Number(averageRating))
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              {reviews.length} reviews
            </p>
          </div>

          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((s) => (
              <div key={s} className="flex items-center gap-2 text-sm">
                <span className="w-3">{s}</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      s >= 4
                        ? "bg-emerald-500"
                        : s === 3
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{
                      width: reviews.length
                        ? (distribution[s] / reviews.length) * 100
                        : 0,
                    }}
                  />
                </div>
                <span className="w-6 text-muted-foreground">
                  {distribution[s]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Reviews Section ===== */}
        <div className="space-y-4 mt-4">
          {loading && (
            <p className="text-center text-muted-foreground py-6">
              Loading reviews...
            </p>
          )}

          {!loading && reviews.length === 0 && (
            <div className="text-center py-10">
              <p className="text-lg font-medium text-foreground">
                No reviews yet
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Be the first to share your experience with this agent.
              </p>
            </div>
          )}

          {!loading &&
            reviews.map((r) => (
              <div
                key={r.id}
                className="border-b border-border pb-4 last:border-0"
              >
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="font-medium">{r.userName}</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            s <= r.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {new Date(r.date).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm mb-2">{r.comment}</p>

                {/* <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ThumbsUp className="w-3 h-3" />
                  {r.helpfulCount} people found this helpful
                </div> */}
                <button
                  onClick={() => handleHelpfulVote(r.id)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition cursor-pointer"
                >
                  <ThumbsUp className="w-3 h-3" />
                  {r.helpfulCount} people found this helpful
                </button>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
