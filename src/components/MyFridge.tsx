import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { usePantryStore } from '../store/usePantryStore';

export default function MyFridge() {
  const [inputValue, setInputValue] = useState(''); // State for the input field
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term

  const fridgeItems = usePantryStore((state) => state.fridgeItems);  // Taking global action from our zustand store to add items to our fridge, this allows us to manage our fridge state globally and persist it across sessions.
  const addFridgeItem = usePantryStore((state) => state.addFridgeItem); // grabbing global action from our zustand store to add items to our fridge, this allows us to manage our fridge state globally and persist it across sessions.
  const removeFridgeItem = usePantryStore((state) => state.removeFridgeItem); // grabbing global action from our zustand store to remove items from our fridge, this allows us to manage our fridge state globally and persist it across sessions.

  const [now] = useState(() => Date.now()); 

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    addFridgeItem(inputValue.trim());
    setInputValue(''); 
  };

  const { useToday, expiringSoon, stillGood } = useMemo(() => { 
    const categories = { useToday: [] as typeof fridgeItems, expiringSoon: [] as typeof fridgeItems, stillGood: [] as typeof fridgeItems };
    const filteredItems = fridgeItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    filteredItems.forEach(item => {
      const daysInFridge = (now - item.dateAdded) / (1000 * 60 * 60 * 24);
      if (daysInFridge >= 5) categories.useToday.push(item);
      else if (daysInFridge >= 3) categories.expiringSoon.push(item);
      else categories.stillGood.push(item);
    });
    
    return categories;
  }, [fridgeItems, now, searchTerm]);

  return (
    <div className="max-w-3xl p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-1">My Fridge</h1>
        <p className="text-gray-500 text-sm">Tap ingredients to remove them · Add what you have</p>
      </div>

      <form onSubmit={handleAdd} className="mb-6">
        <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-[#1a4731] transition-all">
          <div className="pl-3 pr-2 text-gray-400">
            <span>+</span>
          </div>
          
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new ingredient..."
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400 py-2"
          />
          
          <button 
            type="submit"
            className="bg-[#1a4731] hover:bg-[#133524] text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Add
          </button>
        </div>
      </form>

      {fridgeItems.length > 0 && ( // if its empty there is no need to add the search bar and it just looks cleaner without it.
        <div className="mb-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your fridge..."
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#1a4731] focus:bg-white transition-all text-sm"
          />
        </div>
      )}

      <div className="space-y-8">
        {useToday.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-red-600"></div>
              <h3 className="text-sm font-bold text-red-700">Use today</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {useToday.map((item) => (
                <span key={item.id} onClick={() => removeFridgeItem(item.id)} className="bg-red-50 text-red-700 border border-red-100 px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer hover:bg-red-100 transition-colors" title="Click to remove">
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        )}
        {expiringSoon.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <h3 className="text-sm font-bold text-yellow-700">Expiring soon</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {expiringSoon.map((item) => (
                <span key={item.id} onClick={() => removeFridgeItem(item.id)} className="bg-yellow-50 text-yellow-800 border border-yellow-100 px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer hover:bg-yellow-100 transition-colors" title="Click to remove">
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <h3 className="text-sm font-bold text-green-700">Still good</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {stillGood.length === 0 ? <p className="text-sm text-gray-400">No matching items.</p> : stillGood.map((item) => (
              <span 
                key={item.id} 
                onClick={() => removeFridgeItem(item.id)}
                className="bg-green-50 text-green-800 border border-green-100 px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors group"
                title="Click to remove"
              >
                {item.name} <span className="text-gray-400 group-hover:text-red-500 ml-1">×</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-10 text-right">
        <p className="text-sm text-gray-400">
          {searchTerm ? `Found ${useToday.length + expiringSoon.length + stillGood.length} matching ` : `${fridgeItems.length} active `} 
          ingredients
        </p>
      </div>
    </div>
  );
}