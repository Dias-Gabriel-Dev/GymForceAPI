import User from "../models/User.js";
import Checkin from "../models/Checkin.js";

User.hasMany(Checkin, {
  foreignKey: 'user_id',
  as: 'checkins',
});

Checkin.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

console.log('Associações de modelos configuradas.');

