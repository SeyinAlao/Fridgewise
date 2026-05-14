import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2 } from 'lucide-react';
import { autocompleteRecipes } from '../lib/api';
import { useDebounce } from '../hooks/useDebounce';
import type { AutocompleteResult } from '../types/index'; 

interface RecipeSearchProps {  
//  Added a prop interface so the parent component can actually use the selected recipe!
  onSelectRecipe?: (id: number, title: string) => void;
}

export default function RecipeSearch({ onSelectRecipe }: RecipeSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // to detect clicks outside the dropdown and close it when the user clicks elsewhere on the page, improving the user experience by preventing the dropdown from staying open unintentionally.
  
  const debouncedQuery = useDebounce(query, 300);

  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ['autocomplete', debouncedQuery],
    queryFn: () => autocompleteRecipes(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0, // only fetch when there is a query to search for, this prevents unnecessary API calls when the input is empty.
    staleTime: 1000 * 60 * 5, 
  });

  useEffect(() => { // Effect to handle clicks outside the dropdown and prevent memory leaks.
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-xl z-50" ref={dropdownRef}>
      <div className="relative flex items-center">
        <div className="absolute left-4 text-gray-400">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          placeholder="Craving something specific? Search recipes..."
          className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1a4731] transition-all"
        />
      </div>

      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
          {!isLoading && suggestions.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">
              No recipes found for "{query}". Try another ingredient!
            </div>
          ) : (
            <ul className="max-h-64 overflow-y-auto divide-y divide-gray-50">
              {suggestions.map((suggestion: AutocompleteResult) => (
                <li 
                  key={suggestion.id}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors"
                  onClick={() => {
                    setQuery(suggestion.title);
                    setIsOpen(false) //Call the parent function if it exists!
                    if (onSelectRecipe) {
                      onSelectRecipe(suggestion.id, suggestion.title);
                    }
                  }}
                >
                  <div className="w-8 h-8 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                    <img 
                      src={`https://img.spoonacular.com/recipes/${suggestion.id}-90x90.${suggestion.imageType}`} 
                      alt={suggestion.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {suggestion.title}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}