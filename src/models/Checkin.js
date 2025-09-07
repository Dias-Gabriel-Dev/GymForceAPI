import { Model, DataTypes } from 'sequelize'

class Checkin extends Model {
  static init(sequelize) {
    super.init({},
      {
        sequelize,
        tableName: 'checkins'
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', id: 'user'})
  }
}

export default Checkin;
