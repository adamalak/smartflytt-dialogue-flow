
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Smile, Meh, Frown, ThumbsUp, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment?: string) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    
    onSubmit(rating, comment.trim() || undefined);
    setSubmitted(true);
    
    // Auto-close after showing thank you
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setRating(0);
      setComment('');
    }, 2000);
  };

  const handleSkip = () => {
    onClose();
    setSubmitted(false);
    setRating(0);
    setComment('');
  };

  if (!isOpen) return null;

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md rounded-3xl shadow-2xl bg-white/95 backdrop-blur">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tack för din feedback!</h3>
            <p className="text-gray-600">Din åsikt hjälper oss att bli bättre.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md rounded-3xl shadow-2xl bg-white/95 backdrop-blur">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl">Hur var din upplevelse?</CardTitle>
          <p className="text-gray-600 text-sm">Hjälp oss att förbättra vår tjänst</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Star Rating */}
          <div className="text-center space-y-3">
            <p className="text-sm font-medium text-gray-700">Betygsätt din upplevelse:</p>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-all duration-200"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            
            {/* Rating Labels */}
            <div className="flex justify-between text-xs text-gray-500 px-2">
              <span>Dålig</span>
              <span>Utmärkt</span>
            </div>
          </div>

          {/* Emoji Feedback */}
          <div className="text-center space-y-3">
            <p className="text-sm font-medium text-gray-700">Eller välj känsla:</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setRating(2)}
                className={`p-3 rounded-full transition-all duration-200 ${
                  rating === 2 ? 'bg-red-100 scale-110' : 'hover:bg-gray-100'
                }`}
              >
                <Frown className="w-6 h-6 text-red-500" />
              </button>
              <button
                onClick={() => setRating(3)}
                className={`p-3 rounded-full transition-all duration-200 ${
                  rating === 3 ? 'bg-yellow-100 scale-110' : 'hover:bg-gray-100'
                }`}
              >
                <Meh className="w-6 h-6 text-yellow-500" />
              </button>
              <button
                onClick={() => setRating(5)}
                className={`p-3 rounded-full transition-all duration-200 ${
                  rating === 5 ? 'bg-green-100 scale-110' : 'hover:bg-gray-100'
                }`}
              >
                <Smile className="w-6 h-6 text-green-500" />
              </button>
            </div>
          </div>

          {/* Optional Comment */}
          {rating > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Vill du lägga till en kommentar? (valfritt)
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Berätta gärna mer om din upplevelse..."
                className="rounded-xl border-gray-200 focus:border-smartflytt-400 focus:ring-smartflytt-400"
                rows={3}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1 rounded-xl"
            >
              Hoppa över
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="flex-1 bg-smartflytt-600 hover:bg-smartflytt-700 rounded-xl"
            >
              <Send className="w-4 h-4 mr-2" />
              Skicka
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
