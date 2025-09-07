import { Model, DataTypes } from "sequelize";

class Gym extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        phone: DataTypes.STRING,
        latitude: DataTypes.DECIMAL(9, 6),
        longitude: DataTypes.DECIMAL(9, 6),
      },
      {
        sequelize,
        modelName: "Gym",
      },
    );
  }
}

export default Gym;
