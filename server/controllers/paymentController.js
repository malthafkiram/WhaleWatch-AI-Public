const midtransClient = require("midtrans-client");
const { User } = require("../models");

const snap = new midtransClient.Snap({
  isProduction: false, // Set ke true jika nanti sudah launching bisnis asli
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

class PaymentController {
  // Inisialisasi Transaksi (Dipanggil oleh Frontend saat klik tombol "Beli Premium")
  static async initiatePayment(req, res, next) {
    try {
      const UserId = req.user.id;

      // Cari user yang sedang login
      const user = await User.findByPk(UserId);

      if (!user) {
        return res.status(404).json({ message: "Pengguna tidak ditemukan" });
      }

      // Cek apakah user sudah premium sebelumnya
      if (user.isPremium === true || String(user.isPremium) === "true") {
        return res
          .status(400)
          .json({ message: "Akun kamu sudah berstatus Premium" });
      }

      // Membuat Order ID unik untuk Midtrans (Contoh: WWA-171829381)
      const orderId = `WWA-${UserId}-${Date.now()}`;

      const premiumPrice = 220000;

      // Parameter Transaksi Midtrans
      const parameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: +premiumPrice,
        },
        item_details: [
          {
            id: "PREMIUM_ACCESS",
            price: premiumPrice,
            quantity: 1,
            name: "WWA Premium Access",
          },
        ],
        customer_details: {
          firs_name: user.username,
          email: user.email,
        },
      };

      // Minta Token Snap dari Midtrans
      const transaction = await snap.createTransaction(parameter);

      res.status(200).json({
        message: "Sesi pembayaran berhasil dibuat",
        token: transaction.token, // Token ini yang akan dibaca oleh Pop-up Snap di Frontend
        redirect_url: transaction.redirect_url,
        orderId: orderId,
      });
    } catch (error) {
      next(error);
    }
  }

  // WebHook Notification Handler (Dipanggil otomatis oleh server Midtrans ke Backend kita)
  static async midtransNotification(req, res, next) {
    try {
      const notificationJson = req.body;

      // 1. Ambil order_id langsung dari payload mentah
      const directOrderId = notificationJson.order_id;

      console.log(`Menerima request webhook untuk Order ID: ${directOrderId}`);

      if (!directOrderId || !directOrderId.startsWith("WWA-")) {
        console.log(
          "Terdeteksi tes ping dummy dari Midtrans (ID non-WWA). Melewati validasi API & langsung mengirim respon 200 OK.",
        );
        return res
          .status(200)
          .json({ status: "OK", message: "Test connection successful" });
      }

      // Jika order_id valid diawali "WWA-", lakukan validasi resmi menggunakan SDK Midtrans
      const statusResponse =
        await snap.transaction.notification(notificationJson);

      const orderId = statusResponse.order_id;
      const transactionStatus = statusResponse.transaction_status;
      const fraudStatus = statusResponse.fraud_status;

      console.log(
        `Notifikasi Transaksi Valid Diterima | Order ID: ${orderId} | Status: ${transactionStatus}`,
      );

      // Ekstrak UserId dari format Order ID (WWA-UserId-Timestamp)
      const parts = orderId.split("-");
      const targetUserId = parts[1];

      if (targetUserId) {
        if (
          transactionStatus === "capture" ||
          transactionStatus === "settlement"
        ) {
          if (fraudStatus === "challenge") {
            console.log(`Transaksi ${orderId} berstatus challenge.`);
          } else if (fraudStatus === "accept" || fraudStatus === undefined) {
            // Transaksi Sukses! Update status user menjadi premium di database
            await User.update(
              { isPremium: true },
              { where: { id: targetUserId } },
            );
            console.log(
              `User ID ${targetUserId} berhasil ditingkatkan ke Premium otomatis.`,
            );
          }
        } else if (
          transactionStatus === "cancel" ||
          transactionStatus === "deny" ||
          transactionStatus === "expire"
        ) {
          await User.update(
            { isPremium: false },
            { where: { id: targetUserId } },
          );
          console.log(`Transaksi ${orderId} gagal.`);
        }
      }

      res.status(200).json({ status: "OK" });
    } catch (error) {
      console.error("Error pada Webhook Midtrans:", error.message);
      next(error);
    }
  }
}

module.exports = PaymentController;
