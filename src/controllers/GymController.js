import Gym from "../models/Gym.js";

class GymController {
  async create(req, res) {
    try {
      const { name, description, phone, latitude, longitude } = req.body;

      const gym = await Gym.create({
        name,
        description,
        phone,
        latitude,
        longitude,
      });

      return res.status(201).json(gym);
    } catch (error) {
      return res.status(500).json({ error: "Falha ao criar academia." });
    }
  }
}

export default new GymController();
