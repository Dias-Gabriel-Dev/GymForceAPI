import express from 'express';
import userRoutes from './routes/userRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js';
import checkinRoutes from './routes/checkinRoutes.js';

const app = express();

app.use(express.json());

// Rotas públicas
app.use(userRoutes);
app.use(sessionRoutes);

// Rotas protegidas
app.use(dashboardRoutes);
app.use(checkinRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'GymForce API is running!' });
});

export default app;