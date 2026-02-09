import { useState } from "react";
import {
  Star,
  Calendar,
  MapPin,
  MessageCircle,
  ThumbsUp,
  Pencil,
} from "lucide-react";
import axios from "axios";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { baseURL } from "@/utils/constant/url";
import { toast } from "react-toastify";

interface Review {
  id: string;
  packageTitle: string;
  agentName: string;
  rating: number;
  comment: string;
  date: Date;
  tripDate: Date;
  location: string;
  helpful: number;
  verified: boolean;
}

interface CompletedTrip {
  id: string;
  packageTitle: string;
  agentName: string;
  agentId: string;
  completionDate: Date;
  location: string;
  hasReview: boolean;
}

export const ReviewsPage = () => {
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [selectedTrip, setSelectedTrip] = useState<CompletedTrip | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingReviews, setPendingReviews] = useState<CompletedTrip[]>([]);
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewMode, setReviewMode] = useState<"create" | "edit">("create");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const StarRating = ({
    rating,
    interactive = false,
    onRatingChange,
  }: {
    rating: number;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
  }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange?.(star)}
            className={`${
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
            } transition-transform`}
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const handleSubmitReview = async () => {
    if (newReview.rating === 0 || !newReview.comment.trim()) return;

    try {
      const payload = {
        customerId: Number(userId),
        packageId: Number(selectedTrip?.id),
        agentId: Number(selectedTrip?.agentId ?? 0),
        reviewText: newReview.comment,
        rating: newReview.rating,
        isVerified: true,
        isFlagged: false,
        flaggedReason: "",
        createdBy: Number(userId),
        updatedBy: Number(userId),
      };

      if (reviewMode === "create") {
        await axios.post(`${baseURL}customer-reviews`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        toast.success("Review submitted successfully");
      } else {
        await axios.put(
          `${baseURL}customer-reviews/${editingReviewId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        toast.success("Review updated successfully");
      }

      setIsDialogOpen(false);
      setSelectedTrip(null);
      setEditingReviewId(null);
      setReviewMode("create");
      setNewReview({ rating: 0, comment: "" });

      fetchReviews();
    } catch (error) {
      console.error("Review submit failed", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!userId || !token) return;
    fetchReviews();
  }, [userId, token]);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${baseURL}customer-reviews/byUser/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const pending: CompletedTrip[] = [];
      const completed: Review[] = [];

      res.data.forEach((item: any) => {
        const pkg = item.packageDetails;

        if (item.reviewId === null) {
          pending.push({
            id: pkg.packageId.toString(),
            packageTitle: pkg.packageName,
            agentName: pkg.agentName,
            agentId: pkg.agentId.toString(),
            completionDate: new Date(pkg.arrivalDate),
            location: `${pkg.cityName}, ${pkg.stateName}`,
            hasReview: false,
          });
        } else {
          completed.push({
            id: item.reviewId.toString(),
            packageTitle: pkg.packageName,
            agentName: pkg.agentName,
            rating: item.rating,
            comment: item.reviewText,
            date: new Date(item.postedAt),
            tripDate: new Date(pkg.departureDate),
            location: `${pkg.cityName}, ${pkg.stateName}`,
            helpful: item.helpfulVotes ?? 0,
            verified: item.isVerified ?? false,
          });
        }
      });

      setPendingReviews(pending);
      setMyReviews(completed);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-muted-foreground">
        Loading reviews...
      </div>
    );
  }

  return (
    <div className="space-y-8 m-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">Reviews & Feedback</h1>
        <p className="text-muted-foreground mt-2">
          Share your experience and help other pilgrims choose the right
          packages
        </p>
      </div>

      {/* Pending Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Reviews</CardTitle>
          <CardDescription>
            Share your experience for completed trips
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {pendingReviews.length > 0 ? (
            pendingReviews.map((trip) => (
              <div
                key={trip.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <h4 className="font-medium">{trip.packageTitle}</h4>
                  <p className="text-sm text-muted-foreground">
                    {trip.agentName}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Completed {trip.completionDate.toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{trip.location}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setSelectedTrip(trip);
                    setIsDialogOpen(true);
                  }}
                >
                  Write Review
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-10">
              No pending reviews. Completed trips will appear here when feedback
              is required.
            </p>
          )}
        </CardContent>
      </Card>

      {/* My Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>My Reviews</CardTitle>
          <CardDescription>
            Reviews you've written for completed trips
          </CardDescription>
        </CardHeader>

        <CardContent>
          {myReviews.length > 0 ? (
            <div className="space-y-6">
              {myReviews.map((review) => (
                <div key={review.id} className="border-b pb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">{review.packageTitle}</h4>
                      <p className="text-sm text-muted-foreground">
                        {review.agentName}
                      </p>
                      <div className="flex items-center gap-4">
                        <StarRating rating={review.rating} />
                        <Badge
                          variant={review.verified ? "default" : "secondary"}
                        >
                          {review.verified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>Posted {review.date.toLocaleDateString()}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Trip: {review.tripDate.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-end mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1.5 text-primary hover:text-primary hover:bg-primary/10 transition-colors"
                          onClick={() => {
                            setReviewMode("edit");
                            setEditingReviewId(review.id);
                            setSelectedTrip({
                              id: review.id,
                              packageTitle: review.packageTitle,
                              agentName: review.agentName,
                              agentId: "",
                              completionDate: review.tripDate,
                              location: review.location,
                              hasReview: true,
                            });

                            setNewReview({
                              rating: review.rating,
                              comment: review.comment,
                            });

                            setIsDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-3 w-3" />
                          Modify
                        </Button>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm mb-3">{review.comment}</p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{review.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{review.helpful} found helpful</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>Share</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-10">
              No reviews submitted yet
            </p>
          )}
        </CardContent>
      </Card>

      {/* Review Guidelines */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">Review Guidelines</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be honest and constructive in your feedback</li>
                <li>• Focus on your experience with the service quality</li>
                <li>
                  • Mention specific aspects like accommodation, transport, and
                  guidance
                </li>
                <li>• Avoid personal information or inappropriate content</li>
                <li>• Help fellow pilgrims make informed decisions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setSelectedTrip(null);
            setEditingReviewId(null);
            setReviewMode("create");
            setNewReview({ rating: 0, comment: "" });
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {reviewMode === "edit" ? "Modify Review" : "Write Review"}
            </DialogTitle>

            <DialogDescription>
              Share your experience for {selectedTrip?.packageTitle}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Rating</Label>
              <StarRating
                rating={newReview.rating}
                interactive
                onRatingChange={(rating) =>
                  setNewReview((prev) => ({ ...prev, rating }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Your Review</Label>
              <Textarea
                id="comment"
                rows={5}
                placeholder="Share your experience..."
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={newReview.rating === 0 || !newReview.comment.trim()}
              >
                {reviewMode === "edit" ? "Update Review" : "Submit Review"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
