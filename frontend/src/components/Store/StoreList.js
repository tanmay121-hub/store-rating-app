import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiStar, FiEdit, FiPlus } from "react-icons/fi";
import { storeAPI, ratingAPI } from "../../services/api";
import toast from "react-hot-toast";
import StoreCard from "./StoreCard";
import RatingModal from "./RatingModal";
import StoreForm from "./StoreForm"; // Import the new StoreForm component

const StoreList = ({ isAdmin = false }) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    name: "",
    address: "",
  });
  const [selectedStore, setSelectedStore] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showStoreForm, setShowStoreForm] = useState(false); // New state for store form

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await storeAPI.getStores(searchFilters);
      setStores(response.data);
    } catch (error) {
      toast.error("Failed to fetch stores");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores();
  };

  const handleRating = (store) => {
    setSelectedStore(store);
    setShowRatingModal(true);
  };

  const submitRating = async (rating) => {
    try {
      await ratingAPI.submitRating({
        storeId: selectedStore.id,
        rating,
      });
      toast.success("Rating submitted successfully");
      setShowRatingModal(false);
      fetchStores();
    } catch (error) {
      toast.error("Failed to submit rating");
    }
  };

  // New handler for adding store
  const handleAddStore = () => {
    setSelectedStore(null);
    setShowStoreForm(true);
  };

  // New handler for editing store (if needed in future)
  const handleEditStore = (store) => {
    setSelectedStore(store);
    setShowStoreForm(true);
  };

  // New handler for when store is saved
  const handleStoreSaved = () => {
    setShowStoreForm(false);
    fetchStores();
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmin ? "Manage Stores" : "Browse Stores"}
          </h1>
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddStore}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-md"
            >
              <FiPlus />
              Add Store
            </motion.button>
          )}
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchFilters.name}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, name: e.target.value })
                }
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by address..."
                value={searchFilters.address}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    address: e.target.value,
                  })
                }
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button
              type="submit"
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {stores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store, index) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <StoreCard
                  store={store}
                  onRate={() => handleRating(store)}
                  onEdit={isAdmin ? () => handleEditStore(store) : null}
                  isAdmin={isAdmin}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FiSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No stores found</p>
            {isAdmin && (
              <p className="text-gray-400 mt-2">
                Click "Add Store" to create your first store
              </p>
            )}
          </div>
        )}
      </motion.div>

      {showRatingModal && (
        <RatingModal
          store={selectedStore}
          onClose={() => setShowRatingModal(false)}
          onSubmit={submitRating}
          currentRating={selectedStore?.userRating}
        />
      )}

      {showStoreForm && (
        <StoreForm
          store={selectedStore}
          onClose={() => setShowStoreForm(false)}
          onSave={handleStoreSaved}
        />
      )}
    </div>
  );
};

export default StoreList;
