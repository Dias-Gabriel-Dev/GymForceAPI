import "dotenv/config";
import app from "./app.js";
import Database from "./database/index.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await Database.testConnectionAndSync();
    console.log("Banco de dados conectado e sincronizado.");

    app.listen(PORT, () => {
      console.log(`Projeto GymForce API iniciado! at port ${PORT}`);
    });
  } catch (error) {
    console.error("Falha ao iniciar o servidor:", error);
    process.exit(1);
  }
};

startServer();
