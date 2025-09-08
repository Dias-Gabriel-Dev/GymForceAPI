Ilustração do Projeto: GymForce API


Estrutura de Pastas




gymforce-api/
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
├── package.json
└── src/
    ├── app.js
    ├── server.js
    ├── config/
    │   └── databaseConfig.js
    ├── database/
    │   ├── association.js
    │   └── index.js
    ├── middlewares/
    │   └── auth.js
    ├── models/
    │   ├── Checkin.js
    │   ├── Gym.js
    │   └── User.js
    ├── controllers/
    │   ├── CheckinController.js
    │   ├── GymController.js
    │   ├── SessionController.js
    │   └── UserController.js
    └── routes/
        ├── checkinRoutes.js
        ├── dashboardRoutes.js
        ├── gymRoutes.js
        ├── index.js
        ├── sessionRoutes.js
        └── userRoutes.js



Conteúdo dos Arquivos


Arquivos da Raiz do Projeto

<details>
<summary><code>package.json</code></summary>

JSON


{
  "name": "gymforce-api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon --legacy-watch src/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "bcryptjs": "^3.0.2",
    "dotenv": "^17.2.2",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.16.3",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.37.7"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}


</details>
<details>
<summary><code>Dockerfile</code></summary>

Dockerfile


# 1. Usar uma imagem base oficial do Node.js
FROM node:18-alpine

# 2. Definir o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# 3. Copiar os arquivos de dependência e instalar
#    Copiamos primeiro para aproveitar o cache do Docker
COPY package*.json ./
RUN npm install

# 4. Copiar o restante do código da sua aplicação
COPY . .

# 5. Expor a porta em que sua aplicação roda (ajuste se for diferente)
EXPOSE 3000

# 6. Definir o comando para iniciar a aplicação em modo de desenvolvimento
CMD [ "npm", "run", "dev" ]


</details>
<details>
<summary><code>.dockerignore</code></summary>



node_modules
npm-debug.log
.env


</details>
<details>
<summary><code>docker-compose.yml</code></summary>

YAML


version: '3.8'

services:
  # Serviço do Banco de Dados PostgreSQL
  db:
    image: postgres:15-alpine
    container_name: gymforce_db
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: gymforce_db
    volumes:
      - gymforceapi_postgres_data:/var/lib/postgresql/data

  # Serviço da API
  api:
    build: .
    container_name: gymforce_api
    restart: always
    ports:
      - "3000:3000"
    environment:
      DB_HOST: db
      DB_USER: docker
      DB_PASS: docker
      DB_NAME: gymforce_db
      APP_SECRET: gymforce_senha_secreta
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
    depends_on:
      - db

volumes:
  gymforceapi_postgres_data:


</details>

Arquivos do Diretório src

<details>
<summary><code>src/server.js</code></summary>

JavaScript


import 'dotenv/config';
import app from './app.js';
import Database from './database/index.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await Database.testConnectionAndSync();
    console.log('Banco de dados conectado e sincronizado com sucesso.');
    
    app.listen(PORT, () => {
      console.log(`🚀 Projeto GymForce API iniciado! Rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
};

startServer();


</details>
<details>
<summary><code>src/app.js</code></summary>

JavaScript


import express from 'express';
import routes from './routes/index.js';

const app = express();

app.use(express.json());

app.use(routes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'GymForce API is running!' });
});

export default app;


</details>

src/config/

<details>
<summary><code>databaseConfig.js</code></summary>

JavaScript


import 'dotenv/config';

export default {
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


</details>

src/database/

<details>
<summary><code>index.js</code></summary>

JavaScript


import Sequelize from "sequelize";
import databaseConfig from "../config/databaseConfig.js";

import User from "../models/User.js";
import Checkin from "../models/Checkin.js";
import Gym from "../models/Gym.js";

const models = [User, Checkin, Gym];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.forEach(model => model.init(this.connection));

    // Este trecho foi substituído pelo association.js, mas mantido por segurança.
    // O ideal é usar apenas um dos padrões.
    models.forEach(model => {
      if (model.associate) {
        model.associate(this.connection.models);
      }
    });

    console.log('Conexão com o banco de dados e modelos inicializados.');
  }

  async testConnectionAndSync() {
    try {
      await this.connection.authenticate();
      console.log('Conexão com o banco de dados estabelecida com sucesso.');
      await this.connection.sync({ alter: true });
      console.log('Modelos sincronizados com o banco de dados.');
    } catch (error) {
      console.error('Não foi possível conectar ou sincronizar o banco de dados:', error);
      throw error;
    }
  }
}

export default new Database();


</details>
<details>
<summary><code>association.js</code></summary>

JavaScript


import User from "../models/User.js";
import Checkin from "../models/Checkin.js";
import Gym from "../models/Gym.js";

User.hasMany(Checkin, { foreignKey: 'user_id', as: 'checkins' });
Checkin.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Gym.hasMany(Checkin, { foreignKey: 'gym_id', as: 'checkins' });
Checkin.belongsTo(Gym, { foreignKey: 'gym_id', as: 'gym' });

console.log('Associações de modelos configuradas.');


</details>

src/middlewares/

<details>
<summary><code>auth.js</code></summary>

JavaScript


import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, process.env.APP_SECRET);
    req.userId = decoded.id;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
};


</details>

src/models/

<details>
<summary><code>User.js</code></summary>

JavaScript


// OBS: Código inferido com base nos controllers e no banco.
import { Model, DataTypes } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password_hash: DataTypes.STRING,
    }, {
      sequelize,
      modelName: 'User',
    });
  }
}

export default User;


</details>
<details>
<summary><code>Gym.js</code></summary>

JavaScript


import { Model, DataTypes } from 'sequelize';

class Gym extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      phone: DataTypes.STRING,
      latitude: DataTypes.DECIMAL(9, 6),
      longitude: DataTypes.DECIMAL(9, 6),
    }, {
      sequelize,
      modelName: 'Gym',
    });
  }
}

export default Gym;


</details>
<details>
<summary><code>Checkin.js</code></summary>

JavaScript


// OBS: Código inferido com base nos controllers e no banco.
import { Model, DataTypes } from 'sequelize';

class Checkin extends Model {
  static init(sequelize) {
    super.init({
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      gym_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'Checkin',
    });
  }
}

export default Checkin;


</details>

src/controllers/

<details>
<summary><code>UserController.js</code></summary>

JavaScript


import User from "../models/User.js";
import bcrypt from "bcryptjs";

class UserController {
  async create(req, res) {
    try {
      const { name, email, password } = req.body;

      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'Este e-mail já está em uso.' });
      }

      const password_hash = await bcrypt.hash(password, 8);

      const user = await User.create({
        name,
        email,
        password_hash,
      });

      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      console.error('ERRO NO USER CONTROLLER:', error);
      return res.status(500).json({ error: 'Falha ao criar usuário.', details: error.message });
    }
  }
}

export default new UserController();


</details>
<details>
<summary><code>SessionController.js</code></summary>

JavaScript


import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

class SessionController {
  async create(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    const { id, name } = user;

    const token = jwt.sign(
      { id, name, email },
      process.env.APP_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token,
    });
  }
}

export default new SessionController();


</details>
<details>
<summary><code>GymController.js</code></summary>

JavaScript


import Gym from '../models/Gym.js';

class GymController {
  async create(req, res) {
    try {
      const { name, description, phone, latitude, longitude } = req.body;

      const gym = await Gym.create({
        name,
        description,
        phone,
        latitude,
        longitude,
      });

      return res.status(201).json(gym);
    } catch (error) {
      console.error('Erro ao criar academia:', error);
      return res.status(500).json({ error: 'Falha ao criar academia.' });
    }
  }
}

export default new GymController();


</details>
<details>
<summary><code>CheckinController.js</code></summary>

JavaScript


import { Op } from 'sequelize';
import Checkin from "../models/Checkin.js";
import Gym from '../models/Gym.js';

class CheckinController {
  async index(req, res) {
    try {
      const { userId } = req;
      const { page = 1 } = req.query;
      const limit = 20;

      const checkins = await Checkin.findAll({
        where: {
          user_id: userId,
        },
        order: [['createdAt', 'DESC']],
        limit: limit,
        offset: (page - 1) * limit,
      });

      return res.json(checkins);
    } catch (error) {
      console.error('Erro ao listar check-ins:', error);
      return res.status(500).json({ error: 'Falha ao buscar histórico de check-ins.' });
    }
  }

  async create(req, res) {
    try {
      const { userId } = req;
      const { gymId } = req.params;

      const gym = await Gym.findByPk(gymId);
      if (!gym) {
        return res.status(404).json({ error: 'Academia não encontrada.' });
      }

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const existingCheckin = await Checkin.findOne({
        where: {
          user_id: userId,
          createdAt: {
            [Op.between]: [startOfDay, endOfDay],
          },
        },
      });

      if (existingCheckin) {
        return res.status(409).json({ error: 'Check-in já realizado no dia de hoje.' });
      }

      const checkin = await Checkin.create({
        user_id: userId,
        gym_id: gymId,
      });

      return res.status(201).json(checkin);
    } catch (error) {
      console.error('Erro ao criar check-in:', error);
      return res.status(500).json({ error: 'Falha ao processar check-in.' });
    }
  }
}

export default new CheckinController();


</details>

src/routes/

<details>
<summary><code>index.js</code></summary>

JavaScript


import { Router } from 'express';

import sessionRoutes from './sessionRoutes.js';
import userRoutes from './userRoutes.js';
import gymRoutes from './gymRoutes.js';
import checkinRoutes from './checkinRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const routes = Router();

routes.use(sessionRoutes);
routes.use(userRoutes);
routes.use(checkinRoutes);
routes.use(gymRoutes);
routes.use(dashboardRoutes);

export default routes;


</details>
<details>
<summary><code>userRoutes.js</code></summary>

JavaScript


import { Router } from "express";
import UserController from "../controllers/UserController.js";

const router = new Router();

router.post('/users', UserController.create);

export default router;


</details>
<details>
<summary><code>sessionRoutes.js</code></summary>

JavaScript


import { Router } from 'express';
import SessionController from '../controllers/SessionController.js';

const router = new Router();

router.post('/sessions', SessionController.create);

export default router;


</details>
<details>
<summary><code>gymRoutes.js</code></summary>

JavaScript


import { Router } from "express";
import GymController from "../controllers/GymController.js";
import CheckinController from "../controllers/CheckinController.js";
import authMiddleware from "../middlewares/auth.js";

const router = new Router();

router.post('/gyms', GymController.create);

router.post('/gyms/:gymId/checkins', authMiddleware, CheckinController.create);

export default router;


</details>
<details>
<summary><code>checkinRoutes.js</code></summary>

JavaScript


import { Router } from 'express';
import CheckinController from '../controllers/CheckinController.js';
import authMiddleware from '../middlewares/auth.js';

const router = new Router();

router.use(authMiddleware);

router.get('/checkins', CheckinController.index);

export default router;


</details>
<details>
<summary><code>dashboardRoutes.js</code></summary>

JavaScript


import { Router } from 'express';
import authMiddleware from '../middlewares/auth.js';

const router = new Router();

router.get('/dashboard', authMiddleware, (req, res) => {
  res.json({
    message: `Bem-vindo ao dashboard!`,
    user: req.userId
  });
});

export default router;


</details>
Este é o estado atual do projeto. A partir de agora, usaremos esta estrutura como nossa referência para continuar o desenvolvimento.
