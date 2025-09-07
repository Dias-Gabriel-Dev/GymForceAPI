import "dotenv/config";

export default {
  dialect: "postgres",
  host: process.env.DB_HOST || "localhost",
  username: process.env.DB_USER || "docker",
  password: process.env.DB_PASS || "docker",
  database: process.env.DB_NAME || "gymforce_db",
  define: {
    timestamps: true,
    underscore: true,
    underscoreAll: true,
  },
  logging: console.log,
};
