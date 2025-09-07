import express from "express";
import routes from './routes/index.js';

const app = express();

app.use(express.json());

app.use(routes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "GymForce API is running!" });
});

export default app;
