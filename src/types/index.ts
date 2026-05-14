export interface RecipeResult {
  id: number;
  title: string;
  image: string;
  missedIngredientCount: number;
  usedIngredientCount: number;
  sourceUrl?: string; 
  pricePerServing?: number; 
}

export interface Ingredient {
  id: string;
  name: string;
  dateAdded: number;
}

export interface Meal {
  id: number; 
  title: string;
  image: string;
  priceInUSD: number; 
}

export interface PantryState {
  fridgeItems: Ingredient[];
  mealPlan: Meal[];
  totalWeeklyBudgetNGN: number;
  exchangeRate: number;

  addFridgeItem: (item: string) => void;
  removeFridgeItem: (id: string) => void;
  addMealToPlan: (meal: Meal) => void;
  removeMealFromPlan: (mealId: number) => void;
  updateExchangeRate: (newRate: number) => void;
  resetStore: () => void;
}

export interface AutocompleteResult {
  id: number;
  title: string;
  imageType: string;
}