import User from "../models/User.js";
import Checkin from "../models/Checkin.js";
import Gym from "../models/Gym.js";

User.hasMany(Checkin, {
  foreignKey: "user_id",
  as: "checkins",
});

Checkin.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

Gym.hasMany(Checkin, {
  foreignKey: "user_id",
  as: "checkins"
});

console.log("Associações de modelos configuradas.");
