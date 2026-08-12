const { User } = require("../models/index");
const { verifyToken } = require("./jwt");

async function athentication(req, res, next) {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw { name: "unauthenticated" };

    const token = authorization.split(" ")[1];
    if (!token) throw { name: "unauthenticated" };

    const payload = verifyToken(token);

    const user = await User.findByPk(payload.id);
    if (!user) throw { name: "unauthenticated" };

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      isPremium: user.isPremium,
    };

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = athentication;
