const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

const fetcher = async (endpoint: string) => {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Spoonacular API error: ${response.statusText}`);
  }
  return response.json();
};

export const searchRecipes = async (ingredients: string[], searchQuery: string = '') => {
  const params = new URLSearchParams({  // Using URLSearchParams is safer and cleaner than manual string manipulation
    apiKey: API_KEY,
    addRecipeInformation: 'true',
    fillIngredients: 'true',
    number: '10',
    sort: 'min-missing-ingredients'
  });

  if (ingredients.length > 0) {
    params.append('includeIngredients', ingredients.join(','));
  }
  
  if (searchQuery) {
    params.append('query', searchQuery);
  }

  return fetcher(`/recipes/complexSearch?${params.toString()}`);
};

export const autocompleteRecipes = async (query: string) => {
  if (!query) return []; 
  return fetcher(`/recipes/autocomplete?apiKey=${API_KEY}&query=${query}&number=10`);
};

export const fetchPriceBreakdown = async (recipeId: number) => {
  return fetcher(`/recipes/${recipeId}/priceBreakdownWidget.json?apiKey=${API_KEY}`);
};

export const fetchSubstitute = async (ingredientName: string) => {
  return fetcher(`/food/ingredients/substitutes?apiKey=${API_KEY}&ingredientName=${ingredientName}`);
};