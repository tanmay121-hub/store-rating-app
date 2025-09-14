const { Store, Rating, User } = require("../models");
const { Op } = require("sequelize");
const sequelize = require("../config/database");

const getStores = async (req, res) => {
  try {
    const { name, address } = req.query;
    const where = {};

    if (name) where.name = { [Op.like]: `%${name}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      include: [
        {
          model: Rating,
          attributes: ["rating", "userId"],
          required: false,
        },
      ],
    });

    // If user is logged in and is a normal user, get their ratings
    if (req.user && req.user.role === "user") {
      const userRatings = await Rating.findAll({
        where: { userId: req.user.id },
        attributes: ["storeId", "rating"],
      });

      const userRatingsMap = {};
      userRatings.forEach((rating) => {
        userRatingsMap[rating.storeId] = rating.rating;
      });

      stores.forEach((store) => {
        store.dataValues.userRating = userRatingsMap[store.id] || null;
      });
    }

    res.json(stores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const createStore = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { name, email, address, createOwner, ownerName, ownerPassword } =
      req.body;

    // Check if store email already exists
    const existingStore = await Store.findOne({
      where: { email },
      transaction,
    });

    if (existingStore) {
      await transaction.rollback();
      return res.status(400).json({ error: "Store email already registered" });
    }

    // Create the store
    const store = await Store.create(
      {
        name,
        email,
        address,
      },
      { transaction }
    );

    let ownerCredentials = null;
    let message = "Store created successfully";

    // Create store owner if requested
    if (createOwner) {
      // Check if user with store email already exists
      const existingUser = await User.findOne({
        where: { email },
        transaction,
      });

      if (existingUser) {
        await transaction.rollback();
        return res.status(400).json({
          error:
            "A user with this email already exists. Please use a different email for the store.",
        });
      }

      // Create store owner user
      const storeOwner = await User.create(
        {
          name: ownerName,
          email: email, // Store owner uses store email to login
          password: ownerPassword, // This will be hashed by the User model's beforeCreate hook
          address: address,
          role: "store_owner",
          storeId: store.id,
        },
        { transaction }
      );

      ownerCredentials = {
        email: storeOwner.email,
        name: storeOwner.name,
      };

      message = `Store and owner account created successfully. Owner can login with email: ${email}`;

      console.log(`Store owner created for ${name}:`);
      console.log(`  Email: ${email}`);
      console.log(`  Owner Name: ${ownerName}`);
    }

    // Commit the transaction if everything is successful
    await transaction.commit();

    res.status(201).json({
      store,
      ownerCredentials,
      message,
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();
    console.error("Store creation error:", error);
    res
      .status(500)
      .json({ error: "Failed to create store. Please try again." });
  }
};

const getStoreRatings = async (req, res) => {
  try {
    const storeId = req.user.storeId;

    if (!storeId) {
      return res.status(403).json({ error: "Not a store owner" });
    }

    // Get the store details
    const store = await Store.findByPk(storeId, {
      attributes: ["id", "name", "email", "address"],
    });

    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Get all ratings with user details
    const ratings = await Rating.findAll({
      where: { storeId },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]], // Most recent ratings first
    });

    // Calculate statistics
    const ratingStats = await Rating.findOne({
      where: { storeId },
      attributes: [
        [sequelize.fn("AVG", sequelize.col("rating")), "average"],
        [sequelize.fn("COUNT", sequelize.col("rating")), "count"],
        [sequelize.fn("MIN", sequelize.col("rating")), "min"],
        [sequelize.fn("MAX", sequelize.col("rating")), "max"],
      ],
      raw: true,
    });

    // Calculate rating distribution
    const ratingDistribution = await Rating.findAll({
      where: { storeId },
      attributes: [
        "rating",
        [sequelize.fn("COUNT", sequelize.col("rating")), "count"],
      ],
      group: ["rating"],
      raw: true,
    });

    // Format distribution data
    const distribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    ratingDistribution.forEach((item) => {
      distribution[item.rating] = parseInt(item.count);
    });

    res.json({
      store,
      ratings,
      statistics: {
        averageRating: parseFloat(ratingStats?.average) || 0,
        totalRatings: parseInt(ratingStats?.count) || 0,
        minRating: parseInt(ratingStats?.min) || 0,
        maxRating: parseInt(ratingStats?.max) || 0,
        distribution,
      },
    });
  } catch (error) {
    console.error("Get store ratings error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Optional: Add a function to update store details (for future use)
const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address } = req.body;

    const store = await Store.findByPk(id);

    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Check if new email is already taken by another store
    if (email && email !== store.email) {
      const existingStore = await Store.findOne({
        where: {
          email,
          id: { [Op.ne]: id },
        },
      });

      if (existingStore) {
        return res
          .status(400)
          .json({ error: "Email already in use by another store" });
      }
    }

    await store.update({
      name: name || store.name,
      email: email || store.email,
      address: address || store.address,
    });

    res.json({
      message: "Store updated successfully",
      store,
    });
  } catch (error) {
    console.error("Update store error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Optional: Add a function to delete a store (for future use)
const deleteStore = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    const store = await Store.findByPk(id);

    if (!store) {
      await transaction.rollback();
      return res.status(404).json({ error: "Store not found" });
    }

    // Delete associated ratings first
    await Rating.destroy({
      where: { storeId: id },
      transaction,
    });

    // Delete store owner account if exists
    await User.destroy({
      where: {
        storeId: id,
        role: "store_owner",
      },
      transaction,
    });

    // Delete the store
    await store.destroy({ transaction });

    await transaction.commit();

    res.json({ message: "Store deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Delete store error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getStores,
  createStore,
  getStoreRatings,
  updateStore,
  deleteStore,
};
