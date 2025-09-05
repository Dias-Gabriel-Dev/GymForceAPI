import app from './app.js';
import { testConnection } from './config/database.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Projeto GymForce API iniciado! at port ${PORT}`);
  testConnection();
});

// Vamos continuar o projeto GymForce API. prompt para retomar o andamento