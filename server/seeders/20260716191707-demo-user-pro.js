"use strict";

const { hash } = require("../middlewares/bycypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "Wowo Tamvan",
          email: "wowo@gmail.com",
          password: hash("password123"),
          avatar:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
          isPremium: true,
          virtualCash: 75000.0,
          xp: 0,
          level: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    // Menghapus data jika dilakukan rollback seed
    await queryInterface.bulkDelete(
      "Users",
      { email: "pro_trader@whalewatch.ai" },
      {},
    );
  },
};
