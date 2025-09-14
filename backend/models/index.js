const sequelize = require("../config/database");
const User = require("./User");
const Store = require("./Store");
const Rating = require("./Rating");

// Define associations
User.hasMany(Rating, { foreignKey: "userId" });
Rating.belongsTo(User, { foreignKey: "userId" });

Store.hasMany(Rating, { foreignKey: "storeId" });
Rating.belongsTo(Store, { foreignKey: "storeId" });

Store.hasOne(User, { foreignKey: "storeId", as: "owner" });
User.belongsTo(Store, { foreignKey: "storeId", as: "ownedStore" });

module.exports = {
  sequelize,
  User,
  Store,
  Rating,
};
