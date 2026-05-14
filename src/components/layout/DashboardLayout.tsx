import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/react'; 
import { Home, Refrigerator, Utensils, Wallet, LogOut, Menu, X } from 'lucide-react'; 
import { useQueryClient } from '@tanstack/react-query';
import { usePantryStore } from '../../store/usePantryStore';

// the navItems outside the component so it is only created once in memory.
const navItems = [
  { name: 'Home', path: '/dashboard', icon: <Home className="w-5 h-5" />, end: true },
  { name: 'My Fridge', path: '/dashboard/fridge', icon: <Refrigerator className="w-5 h-5" />, end: false },
  { name: 'Recipes', path: '/dashboard/recipes', icon: <Utensils className="w-5 h-5" />, end: false },
  { name: 'Budget', path: '/dashboard/budget', icon: <Wallet className="w-5 h-5" />, end: false },
];

export default function DashboardLayout() {
  const { user } = useUser(); // to extract user from clerk's useUser hook, which provides access to the authenticated user's information, such as their name and profile picture, allowing us to display personalized content in the dashboard layout.
  const { signOut } = useAuth(); 
  const queryClient = useQueryClient(); // to get a reference to the react-query client, which will be used to clear all cached queries on logout, ensuring that any sensitive data fetched during the session is removed from memory when the user logs out.
  const resetStore = usePantryStore((state) => state.resetStore); // reference to the resetStore function from the Zustand store, which will be called on logout to clear the user's pantry data from localStorage, ensuring that no personal data remains after they log out.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // local state for mobile 

  const handleLogout = async () => { // when a user clicks the logout button, this function will be called to perform a comprehensive cleanup of the user's session.
    resetStore(); 
    queryClient.clear();
    await signOut(); 
  };

  // Reusable function to render our navigation links so we don't repeat code for Desktop and Mobile
  const renderNavLinks = (onClickAction = () => {}) => (
    <nav className="px-4 space-y-2">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          end={item.end}
          onClick={onClickAction} // Closes the mobile menu when a link is clicked
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-[#e8f5e9] text-[#1a4731]' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          {item.icon}
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
  const renderUserFooter = () => (
    <div className="p-6 border-t border-gray-50">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-[#e8f5e9] text-[#1a4731] flex items-center justify-center font-bold text-lg overflow-hidden shrink-0">
          {user?.imageUrl ? ( // if a user has an image show if not show the email if not show first letter of their name if not show a default U for user.
            <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            user?.firstName?.charAt(0) || user?.primaryEmailAddress?.emailAddress?.charAt(0).toUpperCase() || 'U'
          )}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-gray-900 truncate">
            {user?.fullName || user?.primaryEmailAddress?.emailAddress || 'User'}
          </p>
          <p className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">View profile</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 hover:text-red-700 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#faf9f6] overflow-hidden">
      <aside className="w-64 bg-white border-r border-gray-100 flex-col justify-between hidden md:flex h-full">
        <div>
          <div className="p-8">
            <h1 className="font-serif text-2xl font-bold text-[#1a4731] flex items-baseline gap-1">
              fridgewise <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            </h1>
          </div>
          {renderNavLinks()}
        </div>
        {renderUserFooter()} {/*// moved the user footer into its own function to avoid repeating code for desktop and mobile, since both versions of the sidebar share the same user info and logout button, this keeps our code DRY and easier to maintain.*/}
      </aside>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <aside className="relative w-64 bg-white h-full flex flex-col justify-between shadow-xl">
            <div>
              <div className="p-6 flex justify-between items-center">
                <h1 className="font-serif text-2xl font-bold text-[#1a4731] flex items-baseline gap-1">
                  fridgewise <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                </h1>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-900">
                  <X className="w-6 h-6" />
                </button>
              </div>
              {/* Pass the close function so clicking a link closes the menu */}
              {renderNavLinks(() => setIsMobileMenuOpen(false))} 
            </div>
            {renderUserFooter()}
          </aside>
        </div>
      )}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="md:hidden bg-white border-b border-gray-100 p-4 flex justify-between items-center shrink-0">
          <h1 className="font-serif text-xl font-bold text-[#1a4731] flex items-baseline gap-1">
            fridgewise <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          </h1>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}