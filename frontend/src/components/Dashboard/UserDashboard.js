import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { FiUser, FiMail, FiMapPin } from "react-icons/fi";

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          User Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FiUser className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{user?.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FiMail className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FiMapPin className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-semibold capitalize">
                  {user?.role?.replace("_", " ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Links
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/stores"
            className="block bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 transition-colors text-center"
          >
            Browse Stores
          </a>
          <a
            href="/profile"
            className="block bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors text-center"
          >
            Update Profile
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default UserDashboard;
