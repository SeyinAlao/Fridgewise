import { useMemo, useState } from 'react';
import { usePantryStore } from '../store/usePantryStore';
import { useClearFridge } from '../hooks/useRecipes';
import { Utensils, Check } from 'lucide-react';
import type { RecipeResult } from '../types/index';
import RecipeSearch from '../components/RecipeSearch'; 

export default function Recipes() {
  const fridgeItems = usePantryStore((state) => state.fridgeItems);
  const addMealToPlan = usePantryStore((state) => state.addMealToPlan); 
  const [addedRecipeId, setAddedRecipeId] = useState<number | null>(null);
  
  const ingredientNames = useMemo(() => {
    return fridgeItems.map((item) => item.name);
  }, [fridgeItems]);

  const { data: recipes, isLoading, isError } = useClearFridge(ingredientNames);

  const handleSearchSelect = (recipeId: number, title: string) => {
    console.log(`User wants to see recipe: ${title} (ID: ${recipeId})`);
  };

  const handleAddToBudget = (recipe: RecipeResult) => {
    addMealToPlan({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      priceInUSD: recipe.pricePerServing ? recipe.pricePerServing / 100 : 5.00 
    });
    
    setAddedRecipeId(recipe.id);
    setTimeout(() => {
      setAddedRecipeId(null);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-1">Recipes</h1>
          <p className="text-gray-500 text-sm">Meals based on what you already have</p>
        </div>
        
        <div className="flex-1 max-w-md w-full">
          <RecipeSearch onSelectRecipe={handleSearchSelect} /> 
        </div>
      </div>

      {ingredientNames.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-gray-300 text-center">
          <Utensils className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Your fridge is empty!</h3>
          <p className="text-gray-500 max-w-sm">
            Head over to the "My Fridge" tab and add some ingredients to see recipe suggestions appear here.
          </p>
        </div>
      )}

      {isLoading && ingredientNames.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((skeleton) => (
            <div key={skeleton} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
          Oops! The chef dropped the database. We couldn't load your recipes right now.
        </div>
      )}

      {recipes?.results?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.results.map((recipe: RecipeResult) => (
            <div key={recipe.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
              <div className="relative overflow-hidden">
                <img 
                  src={recipe.image} 
                  alt={recipe.title} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#1a4731] shadow-sm">
                  Uses {recipe.usedIngredientCount} items
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{recipe.title}</h3>
                <p className="text-sm text-gray-500 mb-6 flex-1">
                  {recipe.missedIngredientCount === 0 
                    ? "You have all the ingredients!" 
                    : `Missing ${recipe.missedIngredientCount} ingredients`}
                </p>
                
                <div className="flex flex-col gap-2 mt-auto">
                  <a 
                    href={recipe.sourceUrl || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full text-center bg-[#f3f9f4] text-[#1a4731] hover:bg-[#1a4731] hover:text-white py-2.5 rounded-xl font-medium transition-colors text-sm"
                  >
                    View Full Recipe
                  </a>
                  
                  <button 
                    onClick={() => handleAddToBudget(recipe)}
                    className={`w-full flex items-center justify-center gap-2 text-center py-2.5 rounded-xl font-medium transition-all duration-200 text-sm border ${
                      addedRecipeId === recipe.id
                        ? 'bg-[#1a4731] border-[#1a4731] text-white'
                        : 'border-[#1a4731] text-[#1a4731] hover:bg-[#f3f9f4]'
                    }`}
                  >
                    {addedRecipeId === recipe.id ? (
                      <>
                        <Check className="w-4 h-4" /> Added!
                      </>
                    ) : (
                      'Add to Budget'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}