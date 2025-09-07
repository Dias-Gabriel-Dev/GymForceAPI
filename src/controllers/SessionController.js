import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

class SessionController {
  async create(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: {email }});
    if(!user) {
      return res.status(401).json({ error: 'Usuário não encontrado.'});
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if(!passwordMatches) {
      return res.status(401).json({ error: 'Senha incorreta.'});
    }

    const { id, name } = user;
    
    const token = jwt.sign(
      {id, name, email },
      process.env.APP_SECRET,
      { expiresIn: '7d'}
    );

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token,
    });
  }
}

export default new SessionController();