const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Store = sequelize.define("Store", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
    validate: {
      len: [20, 60],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: false,
    validate: {
      len: [1, 400],
    },
  },
  averageRating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
});

module.exports = Store;
