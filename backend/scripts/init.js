require("dotenv").config();
const { sequelize, User } = require("../models");

async function createAdmin() {
  try {
    await sequelize.sync();

    const admin = await User.create({
      name: "System Administrator Account",
      email: "admin@example.com",
      password: "Admin@123",
      address: "123 Admin Street, Admin City",
      role: "admin",
    });

    console.log("Admin user created successfully");
    console.log("Email: admin@example.com");
    console.log("Password: Admin@123");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
