import { useUser } from '@clerk/react';
import { usePantryStore } from '../store/usePantryStore';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Refrigerator, Sparkles, Clock, ArrowRight } from 'lucide-react';

export default function Home() {
  const { user } = useUser(); // 
  const navigate = useNavigate();
  
  const fridgeItems = usePantryStore((state) => state.fridgeItems); // calling the global state zustand 
  const [now] = useState(() => Date.now());

  const expiringSoonCount = useMemo(() => { // To ensure im not doing math on every re render 
    return fridgeItems.filter((item) => {
      const addedTime = item.dateAdded || now;
      const daysInFridge = (now - addedTime) / (1000 * 60 * 60 * 24);
      return daysInFridge >= 4;
    }).length;
  }, [fridgeItems, now]);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName || 'Chef'}! 👋
        </h1>
        <p className="text-gray-500 text-sm">Here is what is happening in your kitchen today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-[#e8f5e9] text-[#1a4731] rounded-xl">
            <Refrigerator className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">In your fridge</p>
            <h2 className="text-2xl font-bold text-gray-900">{fridgeItems.length} items</h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Expiring soon</p>
            <h2 className="text-2xl font-bold text-gray-900">{expiringSoonCount} items</h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Meal ideas</p>
            <h2 className="text-2xl font-bold text-gray-900">Ready to cook</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-[#1a4731] rounded-2xl p-8 text-white relative overflow-hidden group cursor-pointer" onClick={() => navigate('/dashboard/fridge')}>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Update your fridge</h3>
            <p className="text-green-100 text-sm mb-6 max-w-xs">
              Just went grocery shopping? Log your new ingredients to keep your recipes accurate.
            </p>
            <button className="flex items-center gap-2 bg-white text-[#1a4731] px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-green-50 transition-colors">
              Go to My Fridge <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute -bottom-6 -right-6 text-green-800 opacity-20 transform group-hover:scale-110 transition-transform duration-500">
            <Refrigerator className="w-40 h-40" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/dashboard/recipes')}>
          <h3 className="text-xl font-bold text-gray-900 mb-2">What's for dinner?</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-xs">
            We've found several recipes that use ingredients you already have. Let's clear that fridge out!
          </p>
          <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
            View Recipes <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}