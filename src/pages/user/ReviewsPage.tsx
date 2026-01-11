import { useState } from 'react'
import { Star, Calendar, MapPin, MessageCircle, ThumbsUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

interface Review {
  id: string
  packageTitle: string
  agentName: string
  rating: number
  comment: string
  date: Date
  tripDate: Date
  location: string
  helpful: number
  verified: boolean
}

interface CompletedTrip {
  id: string
  packageTitle: string
  agentName: string
  agentId: string
  completionDate: Date
  location: string
  hasReview: boolean
}

const mockCompletedTrips: CompletedTrip[] = [
  {
    id: '1',
    packageTitle: 'Premium Hajj Package 2023',
    agentName: 'Al-Haramain Tours',
    agentId: 'agent1',
    completionDate: new Date('2023-08-15'),
    location: 'Mecca & Medina',
    hasReview: false
  }
]

const mockReviews: Review[] = [
  {
    id: '1',
    packageTitle: 'Umrah Package December 2022',
    agentName: 'Blessed Journey Tours',
    rating: 5,
    comment: 'Excellent service throughout the journey. The accommodations were top-notch and the guide was very knowledgeable about the religious significance of each location. Highly recommended!',
    date: new Date('2023-01-10'),
    tripDate: new Date('2022-12-15'),
    location: 'Mecca & Medina',
    helpful: 12,
    verified: true
  }
]

export const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' })
  const [selectedTrip, setSelectedTrip] = useState<CompletedTrip | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  console.log('ReviewsPage rendering, reviews:', reviews.length)

  const StarRating = ({ rating, interactive = false, onRatingChange }: { 
    rating: number
    interactive?: boolean
    onRatingChange?: (rating: number) => void 
  }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange?.(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const handleSubmitReview = () => {
    if (!selectedTrip || newReview.rating === 0 || !newReview.comment.trim()) {
      return
    }

    const review: Review = {
      id: Date.now().toString(),
      packageTitle: selectedTrip.packageTitle,
      agentName: selectedTrip.agentName,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date(),
      tripDate: selectedTrip.completionDate,
      location: selectedTrip.location,
      helpful: 0,
      verified: true
    }

    setReviews(prev => [review, ...prev])
    setNewReview({ rating: 0, comment: '' })
    setSelectedTrip(null)
    setIsDialogOpen(false)

    console.log('Review submitted:', review)
  }

  console.log("token--->", localStorage.getItem("token"))

  return (
    <div className="space-y-8 m-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">Reviews & Feedback</h1>
        <p className="text-muted-foreground mt-2">
          Share your experience and help other pilgrims choose the right packages
        </p>
      </div>

      {/* Pending Reviews */}
      {mockCompletedTrips.some(trip => !trip.hasReview) && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Reviews</CardTitle>
            <CardDescription>
              Share your experience for completed trips
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockCompletedTrips.filter(trip => !trip.hasReview).map((trip) => (
              <div key={trip.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">{trip.packageTitle}</h4>
                  <p className="text-sm text-muted-foreground">{trip.agentName}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Completed {trip.completionDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{trip.location}</span>
                    </div>
                  </div>
                </div>

                <Dialog open={isDialogOpen && selectedTrip?.id === trip.id} onOpenChange={(open) => {
                  setIsDialogOpen(open)
                  if (!open) {
                    setSelectedTrip(null)
                    setNewReview({ rating: 0, comment: '' })
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        setSelectedTrip(trip)
                        setIsDialogOpen(true)
                      }}
                    >
                      Write Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Write Review</DialogTitle>
                      <DialogDescription>
                        Share your experience for {trip.packageTitle}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Rating</Label>
                        <StarRating 
                          rating={newReview.rating} 
                          interactive 
                          onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="comment">Your Review</Label>
                        <Textarea
                          id="comment"
                          placeholder="Share your experience, what you liked, and any suggestions for improvement..."
                          rows={5}
                          value={newReview.comment}
                          onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        />
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setIsDialogOpen(false)
                            setSelectedTrip(null)
                            setNewReview({ rating: 0, comment: '' })
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSubmitReview}
                          disabled={newReview.rating === 0 || !newReview.comment.trim()}
                        >
                          Submit Review
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* My Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>My Reviews</CardTitle>
          <CardDescription>
            Reviews you've written for completed trips
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">{review.packageTitle}</h4>
                      <p className="text-sm text-muted-foreground">{review.agentName}</p>
                      <div className="flex items-center gap-4">
                        <StarRating rating={review.rating} />
                        <Badge variant={review.verified ? 'default' : 'secondary'}>
                          {review.verified ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>Posted {review.date.toLocaleDateString()}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>Trip: {review.tripDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-foreground mb-4 leading-relaxed">
                    {review.comment}
                  </p>

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
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium">No reviews yet</h3>
                <p className="text-sm text-muted-foreground">
                  Complete a trip to share your experience and help other pilgrims
                </p>
              </div>
            </div>
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
                <li>• Mention specific aspects like accommodation, transport, and guidance</li>
                <li>• Avoid personal information or inappropriate content</li>
                <li>• Help fellow pilgrims make informed decisions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}