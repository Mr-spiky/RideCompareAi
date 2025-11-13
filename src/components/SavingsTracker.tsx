import React, { useState, useEffect } from 'react';
import { PiggyBank, TrendingDown, Award } from 'lucide-react';

const SavingsTracker: React.FC = () => {
  const [totalSavings, setTotalSavings] = useState(0);
  const [ridesCompared, setRidesCompared] = useState(0);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('totalSavings');
    const rides = localStorage.getItem('ridesCompared');
    
    if (saved) setTotalSavings(parseInt(saved));
    if (rides) setRidesCompared(parseInt(rides));
  }, []);

  const funFacts = [
    `With ₹${totalSavings}, you could buy ${Math.floor(totalSavings / 50)} cups of chai! ☕`,
    `You've compared ${ridesCompared} rides. That's ${(ridesCompared * 2)} minutes saved! ⏰`,
    `Your savings could pay for ${Math.floor(totalSavings / 200)} movie tickets! 🎬`,
    `Keep going! You're on track to save ₹${(totalSavings * 12).toLocaleString()} this year! 🎯`
  ];

  const [currentFact, setCurrentFact] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % funFacts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalSavings, ridesCompared]);

  if (totalSavings === 0 && ridesCompared === 0) {
    return (
      <div className="glass p-6 rounded-xl text-center">
        <PiggyBank className="w-12 h-12 mx-auto mb-3 text-pink-400" />
        <h3 className="font-semibold text-lg text-white mb-2">Start Saving Today! 🎯</h3>
        <p className="text-white/60 text-sm">
          Compare your first ride to unlock your savings tracker!
        </p>
      </div>
    );
  }

  return (
    <div className="glass p-6 rounded-xl space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <PiggyBank className="w-6 h-6 text-pink-400" />
        <h3 className="font-semibold text-lg text-white">Your Savings 💰</h3>
      </div>

      {/* Total Savings */}
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-500/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm mb-1">Total Saved</p>
            <p className="text-3xl font-bold text-green-400">₹{totalSavings}</p>
          </div>
          <TrendingDown className="w-10 h-10 text-green-400" />
        </div>
      </div>

      {/* Rides Compared */}
      <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-4 border border-blue-500/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm mb-1">Rides Compared</p>
            <p className="text-3xl font-bold text-cyan-400">{ridesCompared}</p>
          </div>
          <Award className="w-10 h-10 text-cyan-400" />
        </div>
      </div>

      {/* Fun Fact */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10 min-h-[80px] flex items-center">
        <p className="text-white/80 text-sm italic transition-all duration-500">
          💡 {funFacts[currentFact]}
        </p>
      </div>

      {/* Achievement Badge */}
      {totalSavings >= 500 && (
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-3 border border-yellow-500/30 text-center animate-pulse">
          <p className="text-yellow-400 font-semibold">🏆 Super Saver Badge Unlocked!</p>
          <p className="text-white/60 text-xs mt-1">You've saved over ₹500!</p>
        </div>
      )}
    </div>
  );
};

export default SavingsTracker;
