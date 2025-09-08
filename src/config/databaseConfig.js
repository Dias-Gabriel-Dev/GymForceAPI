import "dotenv/config";

const testConfig = {
  dialect: 'sqlite',
  storage: './__tests__/database.sqlite',
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};

const devConfig = {
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'docker',
  password: process.env.DB_PASS || 'docker',
  database: process.env.DB_NAME || 'gymforce_db',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
  logging: console.log,
};

export default process.env.NODE_ENV === 'test' ? testConfig : devConfig;
