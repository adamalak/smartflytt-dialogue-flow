
import React, { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
}

interface ConfettiAnimationProps {
  trigger: boolean;
  duration?: number;
}

export const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({
  trigger,
  duration = 3000
}) => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [show, setShow] = useState(false);

  const colors = [
    '#3B82F6', // smartflytt-600
    '#6366F1', // indigo-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#8B5CF6', // violet-500
  ];

  useEffect(() => {
    if (trigger) {
      const pieces: ConfettiPiece[] = [];
      
      // Generate confetti pieces
      for (let i = 0; i < 50; i++) {
        pieces.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 2
        });
      }
      
      setConfetti(pieces);
      setShow(true);
      
      // Hide after duration
      setTimeout(() => {
        setShow(false);
        setConfetti([]);
      }, duration);
    }
  }, [trigger, duration]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            transform: 'rotate(45deg)'
          }}
        />
      ))}
    </div>
  );
};
