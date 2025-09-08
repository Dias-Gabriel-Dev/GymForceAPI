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

  async show(req, res) {
    try {
      const user = await User.findByPk(req.userId);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      const { id, name, email, createdAt, updatedAt } = user;
      return res.json({ id, name, email, createdAt, updatedAt });
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return res.status(500).json({ error: 'Falha ao buscar dados do usuário.' });
    }
  }

  async update(req, res) {
    try {
      const { name, email, oldPassword } = req.body;

      if (name || email) {
        return res.status(403).json({ error: 'Não é permitido alterar nome ou e-mail. Contate o suporte.' });
      }

      const user = await User.findByPk(req.userId);

      if (oldPassword) {
        const passwordMatches = await bcrypt.compare(oldPassword, user.password_hash);
        if (!passwordMatches) {
          return res.status(401).json({ error: 'Senha antiga incorreta.' });
        }

        if (!req.body.password) {
          return res.status(400).json({ error: 'Nova senha não fornecida.' });
        }
        req.body.password_hash = await bcrypt.hash(req.body.password, 8);
      } else {
        return res.status(400).json({ error: 'Para atualizar a senha, forneça a senha antiga e a nova.' });
      }

      await user.update(req.body);

      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return res.status(500).json({ error: 'Falha ao atualizar usuário.' });
    }
  }

  async delete(req, res) {
    try {
      const user = await User.findByPk(req.userId);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      await user.destroy();

      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      return res.status(500).json({ error: 'Falha ao deletar usuário.' });
    }
  }
}

export default new UserController();
