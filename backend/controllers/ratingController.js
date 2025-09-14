const { Rating, Store, User } = require("../models"); // Added User import
const sequelize = require("../config/database");

const submitRating = async (req, res) => {
  try {
    const { rating, storeId } = req.body;
    const userId = req.user.id;

    const existingRating = await Rating.findOne({
      where: { userId, storeId },
    });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
    } else {
      await Rating.create({
        rating,
        userId,
        storeId,
      });
    }

    // Update store average rating
    const avgRating = await Rating.findOne({
      where: { storeId },
      attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "average"]],
      raw: true,
    });

    await Store.update(
      { averageRating: avgRating.average || 0 },
      { where: { id: storeId } }
    );

    res.json({ message: "Rating submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [userCount, storeCount, ratingCount] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count(),
    ]);

    res.json({
      totalUsers: userCount,
      totalStores: storeCount,
      totalRatings: ratingCount,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  submitRating,
  getDashboardStats,
};
