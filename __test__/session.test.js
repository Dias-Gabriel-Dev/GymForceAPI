import request from 'supertest';
import app from '../src/app.js';
import Database from '../src/database/index.js';
import factories from './factories.js';

describe('Sessions', () => {

  it('should be able to authenticate with valid credentials', async () => {
    const user = await factories.createUser({
      password: 'valid_password'
    });

    const response = await request(app)
    .post('/sessions')
    .send({
      email: user.email,
      password: user.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not be able to authenticate with a non-existing user', async () => {
    const response = await request(app)
    .post('/sessions')
    .send({
      email: 'nonexisting@user.com',
      password: 'any_password',
    });

    expect(response.status).toBe(401);
  });

  it('should not be able to authenticate with an incorrect password', async () => {
    const user = await factories.createUser();

    const response = await request(app)
    .post('/sessions')
    .send({
      email: user.email,
      password: 'incorrect_password',
    });

    expect(response.status).toBe(401);
  });
});