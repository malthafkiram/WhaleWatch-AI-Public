"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "virtualCash", {
      type: Sequelize.DECIMAL(15, 2),
      defaultValue: 5000.0,
      allowNull: false,
    });
    await queryInterface.addColumn("Users", "xp", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    });
    await queryInterface.addColumn("Users", "level", {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "virtualCash");
    await queryInterface.removeColumn("Users", "xp");
    await queryInterface.removeColumn("Users", "level");
  },
};
