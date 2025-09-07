import { Op } from "sequelize";
import Checkin from "../models/Checkin.js";
import Gym from "../models/Gym.js";

class CheckinController {
  async index(req, res) {
    try {
      const { userId } = req;
      const { page = 1 } = req.query;
      const limit = 20;

      const checkins = await Checkin.findAll({
        where: {
          user_id: userId,
        },
        order: [["createdAt", "DESC"]],
        limit: limit,
        offset: (page - 1) * limit,
      });

      return res.json(checkins);
    } catch (error) {
      console.error("Erro ao listar check-ins.", error);
      return res
        .status(500)
        .json({ error: "Falha ao buscar histórico de check-ins." });
    }
  }

  async create(req, res) {
    try {
      const { userId } = req;
      const { gymId } = req.params;

      const gym = await Gym.findByPk(gymId);
      if (!gym) {
        return res.status(404).json({ error: 'Academia não encontrada'});
      }

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
        return res
          .status(409)
          .json({ error: "Check-in já realizado no dia de hoje." });
      }

      const checkin = await Checkin.create({
        user_id: userId,
      });

      return res.status(201).json(checkin);
    } catch (error) {
      console.error("Erro ao criar check-in:", error);
      return res.status(500).json({ error: "Falha ao processar check-in." });
    }
  }
}

export default new CheckinController();
