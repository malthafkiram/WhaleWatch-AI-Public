"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Watchlist extends Model {
    static associate(models) {
      // Relasi N:1 ke model User
      Watchlist.belongsTo(models.User, { foreignKey: "UserId" });
    }
  }
  Watchlist.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "UserId tidak boleh kosong" },
          notNull: { msg: "UserId tidak boleh kosong" },
        },
      },
      coinId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Coin ID tidak boleh kosong" },
          notNull: { msg: "Coin ID tidak boleh kosong" },
        },
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Watchlist",
    },
  );
  return Watchlist;
};
