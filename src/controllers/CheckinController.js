import { Op } from 'sequelize';
import Checkin from "../models/Checkin.js";

class CheckinController {
  async create(req, res) {
    try {
      const { userId } = req;

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const existingChecking = await Checkin.findOne({
        where: {
          user_id: userId,
          createdAt: {
            [Op.between]: [startOfDay, endOfDay],
          },
        },
      });

      if (existingChecking) {
        return res.status(409).json({ error: 'Check-in já realizado no dia de hoje.'})
      }

      const checkin = await Checkin.create({
        user_id: userId,
      });

      return res.status(201).json(checkin);
    } catch (error) {
      console.error('Erro ao criar check-in:', error);
      return res.status(500).json({ error: 'Falha ao processar check-in.'})
      
    }
  }
}

export default new CheckinController();