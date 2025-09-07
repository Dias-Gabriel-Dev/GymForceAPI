export default {
  dialect: 'postgres',
  host: 'localhost',
  username: 'docker',
  password: 'docker',
  database: 'gymforce_db',
  define: {
    timestamps: true,
    underscore: true,
    underscoreAll: true,
  },
  logging: console.log,
};

