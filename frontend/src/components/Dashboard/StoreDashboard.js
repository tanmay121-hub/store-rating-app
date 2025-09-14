import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiStar, FiUsers } from "react-icons/fi";
import { storeAPI } from "../../services/api";
import toast from "react-hot-toast";

const StoreDashboard = () => {
  const [storeData, setStoreData] = useState({
    ratings: [],
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStoreRatings();
  }, []);

  const fetchStoreRatings = async () => {
    try {
      const response = await storeAPI.getMyRatings();
      setStoreData(response.data);
    } catch (error) {
      toast.error("Failed to fetch store ratings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Store Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium opacity-90">Average Rating</p>
                <p className="text-4xl font-bold mt-2">
                  {storeData.averageRating?.toFixed(1) || "0.0"}
                </p>
                <div className="flex mt-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(storeData.averageRating)
                          ? "fill-current"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
              <FiStar className="h-12 w-12 opacity-50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium opacity-90">Total Reviews</p>
                <p className="text-4xl font-bold mt-2">
                  {storeData.ratings?.length || 0}
                </p>
              </div>
              <FiUsers className="h-12 w-12 opacity-50" />
            </div>
          </motion.div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Reviews
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {storeData.ratings?.map((rating) => (
                <motion.tr
                  key={rating.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: "#f9fafb" }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {rating.User?.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {rating.User?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`h-4 w-4 ${
                            i < rating.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {storeData.ratings?.length === 0 && (
            <div className="text-center py-8 text-gray-500">No ratings yet</div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StoreDashboard;
