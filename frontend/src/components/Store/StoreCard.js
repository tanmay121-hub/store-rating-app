import React from "react";
import { motion } from "framer-motion";
import { FiStar, FiMapPin, FiMail, FiEdit } from "react-icons/fi";

const StoreCard = ({ store, onRate, onEdit, isAdmin }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        className={`h-4 w-4 ${
          i < Math.round(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 border border-gray-100"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-2">
          {store.name}
        </h3>
        {isAdmin && onEdit && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onEdit}
            className="text-gray-400 hover:text-primary-600 transition-colors"
            title="Edit store"
          >
            <FiEdit className="h-5 w-5" />
          </motion.button>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-start text-sm text-gray-600">
          <FiMapPin className="mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{store.address}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiMail className="mr-2 text-gray-400 flex-shrink-0" />
          <span className="truncate">{store.email}</span>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center">
              {renderStars(store.averageRating || 0)}
              <span className="ml-2 text-sm font-medium text-gray-700">
                {store.averageRating?.toFixed(1) || "0.0"}
              </span>
            </div>
            {store.Ratings && store.Ratings.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {store.Ratings.length}{" "}
                {store.Ratings.length === 1 ? "review" : "reviews"}
              </p>
            )}
          </div>
        </div>

        {store.userRating !== undefined && store.userRating !== null && (
          <div className="bg-primary-50 rounded px-3 py-1.5 mb-3">
            <p className="text-xs text-primary-700 font-medium">
              Your rating: {store.userRating}/5 ⭐
            </p>
          </div>
        )}

        {!isAdmin && onRate && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRate}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors font-medium shadow-sm"
          >
            {store.userRating ? "Update Rating" : "Rate Store"}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default StoreCard;
