import User from "../models/User.js";
import bcrypt from "bcryptjs";

class UserController {
  async create(req, res) {
    try {
      const { name, email, password } = req.body;

      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: "Este e-mail já está em uso." });
      }

      const password_hash = await bcrypt.hash(password, 8);

      const user = await User.create({
        name,
        email,
        password_hash,
      });

      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      console.error("ERRO NO USER CONTROLLER:", error);

      return res
        .status(500)
        .json({ error: "Falha ao criar usuário.", details: error.message });
    }
  }
}

export default new UserController();
