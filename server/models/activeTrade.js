// models/activeTrade.js -> Dibuat manual untuk menyelaraskan ORM dengan DB
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ActiveTrade extends Model {
    /**
     * Helper method untuk mendefinisikan asosiasi relasi database.
     * Metode ini akan dipanggil secara otomatis oleh file models/index.js
     */
    static associate(models) {
      // Relasi Banyak-ke-Satu: Setiap baris taruhan aktif wajib dimiliki oleh satu User
      ActiveTrade.belongsTo(models.User, { foreignKey: "UserId" });
    }
  }

  ActiveTrade.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "UserId transaksi wajib diisi" },
        },
      },
      coinId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Coin ID target tidak boleh kosong" },
        },
      },
      prediction: {
        // Menggunakan ENUM untuk mengunci integritas data di tingkat aplikasi agar hanya menerima dua opsi
        type: DataTypes.ENUM("PUMP", "DUMP"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["PUMP", "DUMP"]],
            msg: "Prediksi pasar wajib bernilai PUMP atau DUMP",
          },
        },
      },
      entryPrice: {
        // Menggunakan DECIMAL untuk akurasi nilai uang agar sinkron dengan file migrasi
        type: DataTypes.DECIMAL(15, 4),
        allowNull: false,
        validate: {
          isDecimal: {
            msg: "Entry price harus berupa format angka desimal valid",
          },
        },
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "PENDING",
      },
    },
    {
      sequelize,
      modelName: "ActiveTrade",
      tableName: "ActiveTrades", // Memaksa pemetaan nama tabel agar sinkron dengan migrasi PostgreSQL
    },
  );

  return ActiveTrade;
};
