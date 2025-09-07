import jwt from 'jsonwebtoken';
import { promisify } from 'util';

export default (req, res, next) => {
  const authHeader = req.headers.authorization;

  if(!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.'});
  }

  const [, token] = authHeader.split(' ');
  

  try {
    const decoded = jwt.verify(token, process.env.APP_SECRET);

    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido.'});
  }
};