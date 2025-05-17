import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { User, LogOut, Settings, Bell } from 'lucide-react';

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">ESP32 Stage Control</h1>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
            </button>
            <button
              type="button"
              className="ml-3 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Settings</span>
              <Settings className="h-6 w-6" />
            </button>
            <div className="ml-3 relative">
              <div className="flex items-center">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">{user?.username || 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-4 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
