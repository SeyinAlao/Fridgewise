import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

export default function RouteError() {
  const error = useRouteError(); // Catches whatever error was thrown in the route

  // Determine the best error message to show based on what crashed
  let errorMessage = "An unexpected error occurred.";
  if (isRouteErrorResponse(error)) {
    errorMessage = error.data || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center p-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Oops! Something snapped.</h1>
      <p className="text-lg text-gray-700 mb-6">We couldn't load this page.</p>
      <p className="text-sm font-mono bg-white p-4 rounded shadow text-red-800">
        {errorMessage}
      </p>
      <Link 
        to="/dashboard"
        className="mt-8 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-block"
      >
        Go Back Home
      </Link>
    </div>
  );
}