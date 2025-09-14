import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { FiMenu, FiX, FiUser, FiLogOut, FiHome } from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = {
    admin: [
      { label: "Dashboard", path: "/admin/dashboard" },
      { label: "Users", path: "/admin/users" },
      { label: "Stores", path: "/admin/stores" },
    ],
    user: [
      { label: "Stores", path: "/stores" },
      { label: "Profile", path: "/profile" },
    ],
    store_owner: [
      { label: "Dashboard", path: "/store/dashboard" },
      { label: "Profile", path: "/profile" },
    ],
  };

  return (
    <nav className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-white text-xl font-bold flex items-center gap-2"
              >
                <FiHome />
                Store Rating System
              </motion.div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user &&
              menuItems[user.role]?.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-white hover:bg-primary-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}

            {user && (
              <div className="flex items-center gap-4 ml-4">
                <span className="text-white text-sm">
                  <FiUser className="inline mr-2" />
                  {user.name}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <FiLogOut />
                  Logout
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-primary-500 p-2 rounded-md"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-primary-700"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user &&
              menuItems[user.role]?.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-white hover:bg-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            {user && (
              <button
                onClick={handleLogout}
                className="text-white hover:bg-red-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
