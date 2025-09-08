import User from "../models/User.js";

export default async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    if (!user.is_admin) {
      return res.status(403).json({ error: 'Acesso negado. Requer permissão de administrador.'});
    }

    return next();
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno na verificação de permissão.'})
  }
};