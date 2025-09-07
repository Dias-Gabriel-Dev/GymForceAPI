import { Router } from 'express';

import sessionRoutes from './sessionRoutes.js';
import userRoutes from './userRoutes.js';
import gymRoutes from './gymRoutes.js';
import checkinRoutes from './checkinRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const routes = Router();

// Rotas públicas e de autenticação
routes.use(sessionRoutes);
routes.use(userRoutes);

// Rotas protegidas
routes.use(checkinRoutes);
routes.use(gymRoutes);
routes.use(dashboardRoutes);

export default routes;