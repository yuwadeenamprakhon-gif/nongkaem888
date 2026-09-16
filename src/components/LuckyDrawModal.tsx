import React, { useEffect, useState } from 'react';
import { Place } from '../types';
import confetti from 'canvas-confetti';
import { Sparkles, Dice5, MapPin, Star, Flame } from 'lucide-react';

interface LuckyDrawModalProps {
  isOpen: boolean;
  sequence: Place[];
  winner: Place | null;
  onFinished: () => void;
}

export const LuckyDrawModal: React.FC<LuckyDrawModalProps> = ({
  isOpen,
  sequence,
  winner,
  onFinished
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isOpen || sequence.length === 0 || !winner) {
      setCurrentIndex(0);
      setIsDone(false);
      return;
    }

    let index = 0;
    let delay = 60; // Initial fast cycle (ms)
    let timerId: NodeJS.Timeout;

    const runStep = () => {
      index++;
      setCurrentIndex(index % sequence.length);

      // Decelerate as we approach the end
      if (index < sequence.length - 10) {
        delay = 55;
      } else if (index < sequence.length - 5) {
        delay += 35;
      } else if (index < sequence.length - 1) {
        delay += 90;
      } else {
        // Land on winner!
        setCurrentIndex(sequence.length - 1);
        setIsDone(true);

        // Fire celebration confetti!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        // Small pause to enjoy the winning card, then open the full result modal
        setTimeout(() => {
          onFinished();
        }, 1200);
        return;
      }

      timerId = setTimeout(runStep, delay);
    };

    timerId = setTimeout(runStep, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [isOpen, sequence, winner, onFinished]);

  if (!isOpen || !winner) return null;

  const currentPlace = sequence[currentIndex] || winner;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-400/50">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-orange-500 p-5 text-center text-white relative">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs mb-2 shadow-inner">
            <Dice5 className={`w-7 h-7 text-white ${!isDone ? 'animate-spin' : ''}`} />
          </div>
          <h3 className="text-xl font-extrabold tracking-tight">
            {isDone ? '🎉 ได้สถานที่แล้ว!' : '🎲 กำลังสุ่มสถานที่...'}
          </h3>
          <p className="text-xs text-amber-100 font-light mt-0.5">
            {isDone ? 'กำลังเตรียมข้อมูลเส้นทาง...' : 'ค้นหาจากฐานข้อมูลสถานที่ท่องเที่ยวชลบุรี'}
          </p>

          {/* Glowing Animated Bar */}
          {!isDone && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 overflow-hidden">
              <div className="h-full bg-white w-1/3 animate-marquee" />
            </div>
          )}
        </div>

        {/* Lucky Draw Display Screen / Card */}
        <div className="p-6">
          <div className="relative rounded-2xl overflow-hidden border-2 border-amber-300 shadow-inner bg-slate-100 aspect-16/10 flex flex-col justify-end">
            <img
              src={currentPlace.image}
              alt={currentPlace.name}
              referrerPolicy="no-referrer"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-75 ${
                isDone ? 'scale-105' : 'scale-100'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

            {/* Live Indicator Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/70 text-white text-[11px] font-medium backdrop-blur-xs border border-white/20">
                <MapPin className="w-3 h-3 text-rose-400" />
                {currentPlace.district}
              </span>
              {currentPlace.popular && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/90 text-white text-[11px] font-bold backdrop-blur-xs shadow-xs">
                  <Flame className="w-3 h-3" />
                  ยอดนิยม
                </span>
              )}
            </div>

            {/* Rapid Cycling Place Name */}
            <div className="relative p-4 text-white z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-amber-300 font-semibold px-2 py-0.5 rounded-md bg-amber-500/20 backdrop-blur-xs border border-amber-400/30">
                  {currentPlace.category[0] || 'จุดเช็คอิน'}
                </span>
                <span className="text-[11px] text-slate-300">
                  คะแนนนิยม {currentPlace.popularityScore}/100
                </span>
              </div>
              <h4 className="text-xl font-bold line-clamp-1 tracking-tight drop-shadow-md">
                {currentPlace.name}
              </h4>
            </div>
          </div>

          {/* Status Message */}
          <div className="mt-5 text-center">
            {isDone ? (
              <div className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 bg-emerald-100 px-4 py-1.5 rounded-full animate-bounce">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>หยุดที่: {winner.name}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>ระบบกำลังคัดเลือกสถานที่ที่เหมาะกับคุณที่สุด...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
