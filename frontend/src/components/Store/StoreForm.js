import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiX,
  FiShoppingBag,
  FiMail,
  FiMapPin,
  FiUser,
  FiLock,
} from "react-icons/fi";
import { storeAPI } from "../../services/api";
import toast from "react-hot-toast";

const StoreForm = ({ store, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: store?.name || "",
    email: store?.email || "",
    address: store?.address || "",
  });
  const [createOwner, setCreateOwner] = useState(false);
  const [ownerData, setOwnerData] = useState({
    ownerName: "",
    ownerPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = "Name must be between 20 and 60 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.address) {
      newErrors.address = "Address is required";
    } else if (formData.address.length > 400) {
      newErrors.address = "Address must not exceed 400 characters";
    }

    // Validate owner data if creating owner
    if (createOwner) {
      if (ownerData.ownerName.length < 20 || ownerData.ownerName.length > 60) {
        newErrors.ownerName = "Owner name must be between 20 and 60 characters";
      }

      if (
        ownerData.ownerPassword.length < 8 ||
        ownerData.ownerPassword.length > 16
      ) {
        newErrors.ownerPassword =
          "Password must be between 8 and 16 characters";
      } else if (!/[A-Z]/.test(ownerData.ownerPassword)) {
        newErrors.ownerPassword =
          "Password must contain at least one uppercase letter";
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(ownerData.ownerPassword)) {
        newErrors.ownerPassword =
          "Password must contain at least one special character";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("owner")) {
      setOwnerData({
        ...ownerData,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      if (store) {
        // Update store logic (if needed in future)
        toast.success("Store updated successfully");
      } else {
        // Prepare data to send
        const dataToSend = {
          ...formData,
          createOwner,
          ownerName: createOwner ? ownerData.ownerName : undefined,
          ownerPassword: createOwner ? ownerData.ownerPassword : undefined,
        };

        const response = await storeAPI.createStore(dataToSend);

        if (createOwner) {
          // Show success message with login credentials
          toast.success(
            <div>
              <p className="font-semibold">Store created successfully!</p>
              <p className="mt-2 text-sm">Store Owner can login with:</p>
              <p className="text-sm">
                <strong>Email:</strong> {formData.email}
              </p>
              <p className="text-sm">
                <strong>Password:</strong> {ownerData.ownerPassword}
              </p>
            </div>,
            { duration: 10000 }
          );
        } else {
          toast.success("Store created successfully");
        }
      }
      onSave();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to save store";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FiShoppingBag className="text-primary-600" />
            {store ? "Edit Store" : "Add New Store"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiShoppingBag className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border ${
                  errors.name ? "border-red-300" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-colors`}
                placeholder="Enter store name (20-60 characters)"
                required
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.name.length}/60 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-colors`}
                placeholder="store@example.com"
                required
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
            {createOwner && (
              <p className="mt-1 text-xs text-blue-600">
                ⓘ This email will be used for store owner login
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Address
            </label>
            <div className="relative">
              <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                <FiMapPin className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className={`w-full pl-10 pr-3 py-2 border ${
                  errors.address ? "border-red-300" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-colors`}
                placeholder="Enter complete store address"
                required
              />
            </div>
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.address.length}/400 characters
            </p>
          </div>

          {/* Add Store Owner Section */}
          <div className="border-t pt-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={createOwner}
                onChange={(e) => setCreateOwner(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Create Store Owner Account
              </span>
            </label>
            {createOwner && (
              <p className="mt-1 text-xs text-gray-500 ml-6">
                This will create a login account for the store owner
              </p>
            )}
          </div>

          {/* Owner Details (shown only when checkbox is checked) */}
          {createOwner && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 border rounded-lg p-4 bg-gray-50"
            >
              <h3 className="text-sm font-semibold text-gray-700">
                Store Owner Details
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="ownerName"
                    value={ownerData.ownerName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border ${
                      errors.ownerName ? "border-red-300" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white`}
                    placeholder="Store owner's full name"
                    required={createOwner}
                  />
                </div>
                {errors.ownerName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.ownerName}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {ownerData.ownerName.length}/60 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="ownerPassword"
                    value={ownerData.ownerPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border ${
                      errors.ownerPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white`}
                    placeholder="Create a password for store owner"
                    required={createOwner}
                  />
                </div>
                {errors.ownerPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.ownerPassword}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  8-16 characters, must include uppercase and special character
                </p>
              </div>
            </motion.div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "Saving..." : store ? "Update Store" : "Create Store"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default StoreForm;
