import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('gymforce_db', 'docker', 'docker', {
  host: 'localhost',
  dialect: 'postgres',
  loggin: console.log,
});

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    // Sincroniza os modelos com o banco de dados.
    // { alter: true } modifica as tabelas para corresponder aos modelos. Não use em produção!
    await sequelize.sync({ alter: true});
    console.log('Modelos sincronizados com o banco de dados');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
};

export default sequelize;

