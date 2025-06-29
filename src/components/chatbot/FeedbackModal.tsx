
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Smile, Meh, Frown, ThumbsUp, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { ConfettiAnimation } from './ConfettiAnimation';

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
      <>
        <ConfettiAnimation trigger={true} duration={2000} />
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="thank-you-title"
        >
          <Card className="w-full max-w-md glass-card shadow-2xl animate-scale-in">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <h3 id="thank-you-title" className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Tack för din feedback!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-base">
                Din åsikt hjälper oss att bli bättre.
              </p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-title"
    >
      <Card className="w-full max-w-md glass-card shadow-2xl animate-scale-in">
        <CardHeader className="text-center pb-4">
          <CardTitle id="feedback-title" className="text-xl font-bold">
            Hur var din upplevelse?
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 text-base">
            Hjälp oss att förbättra vår tjänst
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Star Rating */}
          <div className="text-center space-y-3">
            <p className="text-base font-semibold text-gray-700 dark:text-gray-300">
              Betygsätt din upplevelse:
            </p>
            <div className="flex justify-center space-x-2" role="radiogroup" aria-label="Betyg från 1 till 5 stjärnor">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-2 hover:scale-110 transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-smartflytt-600 touch-target"
                  role="radio"
                  aria-checked={rating === star}
                  aria-label={`${star} stjärnor`}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-200'
                    }`}
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
            
            {/* Rating Labels */}
            <div className="flex justify-between text-base text-gray-500 dark:text-gray-400 px-2">
              <span>Dålig</span>
              <span>Utmärkt</span>
            </div>
          </div>

          {/* Emoji Feedback */}
          <div className="text-center space-y-3">
            <p className="text-base font-semibold text-gray-700 dark:text-gray-300">
              Eller välj känsla:
            </p>
            <div className="flex justify-center space-x-4" role="group" aria-label="Välj känsla med emoji">
              <button
                onClick={() => setRating(2)}
                className={`p-3 rounded-full transition-all duration-200 touch-target focus:outline-none focus:ring-2 focus:ring-smartflytt-600 ${
                  rating === 2 ? 'bg-red-100 dark:bg-red-900/30 scale-110' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                aria-label="Besviken - 2 stjärnor"
              >
                <Frown className="w-6 h-6 text-red-500" aria-hidden="true" />
              </button>
              <button
                onClick={() => setRating(3)}
                className={`p-3 rounded-full transition-all duration-200 touch-target focus:outline-none focus:ring-2 focus:ring-smartflytt-600 ${
                  rating === 3 ? 'bg-yellow-100 dark:bg-yellow-900/30 scale-110' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                aria-label="Okej - 3 stjärnor"
              >
                <Meh className="w-6 h-6 text-yellow-500" aria-hidden="true" />
              </button>
              <button
                onClick={() => setRating(5)}
                className={`p-3 rounded-full transition-all duration-200 touch-target focus:outline-none focus:ring-2 focus:ring-smartflytt-600 ${
                  rating === 5 ? 'bg-green-100 dark:bg-green-900/30 scale-110' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                aria-label="Mycket nöjd - 5 stjärnor"
              >
                <Smile className="w-6 h-6 text-green-500" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Optional Comment */}
          {rating > 0 && (
            <div className="space-y-2">
              <label htmlFor="feedback-comment" className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Vill du lägga till en kommentar? (valfritt)
              </label>
              <Textarea
                id="feedback-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Berätta gärna mer om din upplevelse..."
                className="rounded-2xl border-smartflytt-200 dark:border-gray-600 focus:border-smartflytt-400 focus:ring-smartflytt-400 glass-card text-base"
                rows={3}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1 rounded-2xl glass-button border-smartflytt-200 dark:border-gray-600 text-base font-semibold touch-target"
            >
              Hoppa över
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="flex-1 btn-gradient-primary rounded-2xl text-base font-semibold touch-target"
            >
              <Send className="w-4 h-4 mr-2" aria-hidden="true" />
              Skicka
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
