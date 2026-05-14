import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import RouteError from './components/RouteError';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout'; 

const SignInPage = lazy(() => import('./pages/SignInPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const Home = lazy(() => import('./pages/Home')); 
const MyFridge = lazy(() => import('./components/MyFridge')); 
const Recipes = lazy(() => import('./pages/Recipes'));
const Budget = lazy(() => import('./pages/Budget')); 

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a4731]"></div>
  </div>
);

// protected route and auto search 
const RootLayout = () => {
  return (
    <div className="min-h-screen font-sans bg-gray-50">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteError />, 
    children: [
      {
        index: true,
        element: <Navigate to="/sign-in" replace />, 
      },
      {
        path: 'sign-in/*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SignInPage />
          </Suspense>
        ),
      },
      {
        path: 'sign-up/*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SignUpPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardLayout /> 
          </ProtectedRoute>
        ),
        children: [
          {
            index: true, 
            element: (
              <Suspense fallback={<PageLoader />}>
                <Home /> 
              </Suspense>
            ),
          },
          {
            path: 'fridge', 
            element: (
              <Suspense fallback={<PageLoader />}>
                <MyFridge />
              </Suspense>
            ),
          },
          {
            path: 'recipes', 
            element: (
              <Suspense fallback={<PageLoader />}>
                <Recipes />
              </Suspense>
            ),
          },
          {
            path: 'budget', 
            element: (
              <Suspense fallback={<PageLoader />}>
                <Budget />
              </Suspense>
            ),
          },
        ]
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}