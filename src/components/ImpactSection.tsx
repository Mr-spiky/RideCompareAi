import React from 'react';
import { TrendingUp, Users, DollarSign, Clock } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: "10K+",
    label: "Happy Users",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10"
  },
  {
    icon: DollarSign,
    value: "₹5L+",
    label: "Money Saved",
    color: "text-green-400",
    bgColor: "bg-green-500/10"
  },
  {
    icon: Clock,
    value: "50K+",
    label: "Rides Compared",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10"
  },
  {
    icon: TrendingUp,
    value: "40%",
    label: "Avg. Savings",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10"
  }
];

const ImpactSection: React.FC = () => {
  return (
    <div className="glass p-8 rounded-xl mt-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Our Impact 🌟</h2>
        <p className="text-white/60">Helping riders make smarter choices every day</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} rounded-lg p-4 text-center transform hover:scale-105 transition-all duration-300 cursor-pointer`}
          >
            <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
            <div className={`text-3xl font-bold ${stat.color} mb-1`}>
              {stat.value}
            </div>
            <div className="text-sm text-white/70">{stat.label}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-white/50 text-sm italic">
          "Every ride comparison brings us closer to smarter, more affordable urban mobility" 💚
        </p>
      </div>
    </div>
  );
};

export default ImpactSection;
