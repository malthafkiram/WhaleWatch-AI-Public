"use strict";
const { hash } = require("../middlewares/bycypt");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Watchlist, { foreignKey: "UserId" });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "username is required" },
          notNull: { msg: "username is required" },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: { msg: "email is required" },
          notNull: { msg: "email is required" },
          isEmail: { msg: "please use email formated" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "password is required" },
          notNull: { msg: "password is required" },
          len: {
            args: [8, 30],
            msg: "The minimum password length is 8",
          },
        },
      },
      avatar: DataTypes.TEXT,
      isPremium: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      virtualCash: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 5000.0,
        allowNull: false,
      },
      xp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      level: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
    },
    {
      hooks: {
        beforeCreate: (user, options) => {
          user.password = hash(user.password);
        },
      },
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
