"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ActiveTrades", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
      },
      coinId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      prediction: {
        type: Sequelize.ENUM("PUMP", "DUMP"),
        allowNull: false,
      },
      entryPrice: {
        type: Sequelize.DECIMAL(15, 4),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "PENDING", // PENDING artinya sedang menunggu 1 menit berjalan
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ActiveTrades");
  },
};
