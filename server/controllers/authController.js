const { compare } = require("../middlewares/bycypt");
const { signToken } = require("../middlewares/jwt");
const { User } = require("../models/index");
const user = require("../models/user");

// liblary sign google nya
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();

class AuthController {
  static async register(req, res, next) {
    try {
      const { username, email, password, avatar } = req.body;

      await User.create({
        username,
        email,
        password,
        avatar,
      });

      res.status(201).json({
        message: "Created Successfuly",
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) throw { name: "loginError" };

      let user = await User.findOne({
        where: { email },
      });

      if (!user) throw { name: "loginError" };

      if (!compare(password, user.password)) throw { name: "loginError" };

      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isPremium: user.isPremium,
      };

      const access_token = signToken(payload);

      res.status(200).json({
        message: "login successfuly",
        data: {
          access_token: access_token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            isPremium: user.isPremium,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async loginGoogle(req, res, next) {
    try {
      const access_token_google =
        req.headers.access_token_google || req.headers["access-token-google"];

      // Validasi ketat token masuk
      if (!access_token_google) throw { name: "invalidToken" };

      // Eksekusi verifikasi ke server otorisasi Google
      const ticket = await client.verifyIdToken({
        idToken: access_token_google,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload.email_verified) throw { name: "loginGoogleError" };

      // Password acak aman untuk memenuhi validasi model Sequelize
      const defaultPassword = Math.random().toString(36).slice(-10) + "W@tchA1";

      // Operasi atomik findOrCreate untuk mencegah redundansi baris data
      const [user, created] = await User.findOrCreate({
        where: { email: payload.email },
        defaults: {
          username: payload.name || payload.email.split("@")[0],
          password: defaultPassword,
          avatar: payload.picture,
          isPremium: false,
        },
      });

      // Menandatangani token JWT baru untuk session internal aplikasi
      const access_token = signToken({
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isPremium: user.isPremium,
      });

      res.status(200).json({
        message: "login successfuly",
        data: {
          access_token: access_token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            isPremium: user.isPremium,
          },
        },
        isNewGoogleUser: created,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const userId = req.user.id;

      const freshUser = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
      });

      if (!freshUser) {
        return res.status(404).json({ message: "Pengguna tidak ditemukan." });
      }

      res.status(200).json({
        message: "Berhasil mengambil profil terbaru langsung dari database",
        user: freshUser,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
