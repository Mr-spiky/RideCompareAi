import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer",
    avatar: "👩‍💻",
    quote: "I save ₹500+ every month! This app is a lifesaver for my daily commute.",
    rating: 5,
    savings: "₹6000/year"
  },
  {
    name: "Rahul Verma",
    role: "College Student",
    avatar: "👨‍🎓",
    quote: "As a student on a budget, this helps me choose the cheapest rides without hassle!",
    rating: 5,
    savings: "₹3000/year"
  },
  {
    name: "Anita Patel",
    role: "Business Owner",
    avatar: "👩‍💼",
    quote: "Time is money, and this app saves me both! Quick comparisons, smart choices.",
    rating: 5,
    savings: "₹8000/year"
  }
];

const TestimonialSection: React.FC = () => {
  return (
    <div className="glass p-6 rounded-xl hover:bg-white/25 transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Quote className="w-6 h-6 text-cyan-400" />
        <h3 className="font-semibold text-lg text-white">What Users Say 💬</h3>
      </div>
      
      <div className="space-y-4">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-cyan-400/50 transition-all duration-300"
          >
            <div className="flex items-start gap-3 mb-2">
              <div className="text-3xl">{testimonial.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <div className="flex gap-0.5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-white/50">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-sm text-white/80 italic mb-2">"{testimonial.quote}"</p>
            <div className="flex items-center gap-2 text-xs text-green-400 font-semibold">
              <span>💰 Saved: {testimonial.savings}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-white/40 text-xs">Join 10,000+ satisfied riders! 🎉</p>
      </div>
    </div>
  );
};

export default TestimonialSection;
