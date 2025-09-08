import { faker } from '@faker-js/faker';
import User from '../src/models/User.js';
import bcrypt from 'bcryptjs';

export default {
  async createUser(overrides = {}) {
    const password = overrides.password || faker.internet.password(8);
    const password_hash = await bcrypt.hash(password, 8);

    const userData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password_hash,
      ...overrides,
    };

    const user = await User.create(userData);

    user.password = password;

    return user;
  },
};