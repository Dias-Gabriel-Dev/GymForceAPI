import { Op } from 'sequelize';
import Gym from "../models/Gym.js";
import Database from '../database/index.js';

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

      return res.status(201).json(`Academia cadastrada:\n ${gym}`);
    } catch (error) {
      return res.status(500).json({ error: "Falha ao criar academia." });
    }
  }

  async index(req, res) {
    try {
      const { page = 1 } = req.query;
      const limit = 20;

      const gyms = await Gym.findAll({
        limit: limit,
        offset: (page - 1) * limit,
      });

      return res.json(`Lista de academias cadastradas:\n ${gyms}`);
    } catch (error) {
      console.error('Erro ao listar academias:', error);
      return res.status(500).json({ error: 'Falha ao listar academias.' });
    }
  }

  async search(req, res) {
    try {
      const { latitude, longitude } = req.query;
      const distance = 10;
      
      if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude e Longitude são obrigatórias.'});
      }

      const gyms = await Gym.findAll({
        attributes: [
          'id',
          'name',
          'description',
          'phone',
          'latitude',
          'longitude',
          [
            Database.literal(`6371 * acos(
              cos(radians(${latitude}))* cos(radians(latitude))
              * cos(radians(longitude) - radians(${longitude}))
              + sin(radians(${latitude})) * sin(radians(latitude))
              )`),
              'distance'
          ]
        ],
        having: Database.literal(`distance <= ${distance}`),
        order: Database.literal('distance'),
      });

      return res.json(`Resultados da busca:\n ${gyms}`);
    } catch (error) {
      console.error('Erro ao buscar academias:', error);
      return res.status(500).json({ error: 'Falha ao buscar academias.'});
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;

      const gym = await Gym.findByPk(id);

      if (!gym) {
        return res.status(404).json({ error: 'Academia não encontrada.' });
      }

      const updateGym = await gym.update(req.body);

      return res.json(`Dados da academia atualizados: ${updateGym}`);
    } catch (error) {
      console.error('Erro ao atualizar academia:', error);
      return res.status(500).json({ error: 'Falha ao atualizar academia.'});
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const gym = await Gym.findByPk(id);

      if (!gym) {
        return res.status(404).json({ error: 'Academia não encontrada.' });
      }

      await gym.destroy();

      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar academia:', error);
      return res.status(500).json({ error: 'Falha ao deletar academia.' });
    }
  }
}

export default new GymController();
