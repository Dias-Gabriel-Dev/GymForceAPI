import request from 'supertest';
import app from '../src/app.js';
import Database from '../src/database/index.js';
import factories from './factories.js';

describe('Users', () => {

  it ('should be able to create a new user', async () => {
    const response = await request(app)
    .post('/users')
    .send({
      name: 'Banana',
      email: 'banana@test.com',
      password: 'banana',
    });

    expect(response.status).toBe(201);
    expect(response.body).not.toHaveProperty('password_hash');
    expect(response.body.email).toBe('banana@test.com');
  });

  it('should be able to view profile when authenticated', async () => {
    const user = await factories.createUser();

    const loginResponse = await request(app)
    .post('/sessions')
    .send({
      email: user.email,
      password: user.password,
    });

    const { token } = loginResponse.body;

    const profileResponse = await request(app)
    .get('/user')
    .set('Authorization', `Bearer ${token}`);

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.id).toBe(user.id);
    expect(profileResponse.body.email).toBe(user.email);
  });
});