import Sequelize from "sequelize";
import databaseConfig from "../config/databaseConfig.js";

import User from "../models/User.js";
import Checkin from "../models/Checkin.js";
import Gym from "../models/Gym.js";

const models = [User, Checkin, Gym];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.forEach((model) => model.init(this.connection));

    models.forEach((model) => {
      if (model.associate) {
        model.associate(this.connection.models);
      }
    });

    console.log("Conexão com o banco de dados e modelos inicializados.");
  }

  async testConnectionAndSync() {
    try {
      await this.connection.authenticate();
      console.log("Conexão com o banco de dados estabelecida com sucesso.");
      await this.connection.sync({ alter: true });
      console.log("Modelos sincronizados com o banco de dados.");
    } catch (error) {
      console.error(
        "Não foi possível conectar ou sincronizar o banco de dados:",
        error,
      );
    }
  }
}

export default new Database();
