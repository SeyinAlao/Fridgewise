import { useMemo } from 'react';
import { usePantryStore } from '../store/usePantryStore';
import { Wallet, Trash2, Receipt, TrendingUp, UtensilsCrossed } from 'lucide-react';

export default function Budget() {
  const { 
    mealPlan, 
    exchangeRate, 
    removeMealFromPlan,
    updateExchangeRate
  } = usePantryStore();

  const calculatedTotalNGN = useMemo(() => {
    const totalUSD = mealPlan.reduce((sum, meal) => sum + meal.priceInUSD, 0);
    return totalUSD * exchangeRate;
  }, [mealPlan, exchangeRate]);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-1">Budget Tracker</h1>
        <p className="text-gray-500 text-sm">Monitor your grocery spending and exchange rates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-[#e8f5e9] text-[#1a4731] rounded-xl">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Estimated Cost</p>
            <h2 className="text-2xl font-bold text-gray-900">
              ₦{calculatedTotalNGN.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="w-full">
            <p className="text-gray-500 text-sm font-medium mb-1">USD to NGN Rate</p>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-gray-900">₦</span>
              <input 
                type="number" 
                value={exchangeRate}
                onChange={(e) => updateExchangeRate(Number(e.target.value))}
                className="text-2xl font-bold text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 focus:outline-none w-24"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Planned Meals</p>
            <h2 className="text-2xl font-bold text-gray-900">{mealPlan.length} meals</h2>
          </div>
        </div>
      </div>

      <h3 className="font-bold text-xl text-gray-900 mb-4">Your Meal Plan</h3>
      
      {mealPlan.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-gray-300 text-center">
          <UtensilsCrossed className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No meals planned yet</h3>
          <p className="text-gray-500 max-w-sm">
            Go to the Recipes tab, find a meal you like, and add it to your plan to see the budget breakdown here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {mealPlan.map((meal) => {
              const costInNGN = meal.priceInUSD * exchangeRate;
              
              return (
                <div key={meal.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <img src={meal.image} alt={meal.title} className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-gray-900">{meal.title}</h4>
                      <p className="text-sm text-gray-500">${meal.priceInUSD.toFixed(2)} USD</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-bold text-[#1a4731]">
                        ₦{costInNGN.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <button 
                      onClick={() => removeMealFromPlan(meal.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove from plan"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}