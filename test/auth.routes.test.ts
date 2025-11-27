import request from 'supertest';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import authRoutes from '../src/routes/auth.routes';

jest.mock('../src/services/auth.service', () => ({
  __esModule: true,
  createUser: jest.fn(async (body) => ({ toObject: () => ({ id: 'u1', email: body.email, username: body.username }) })),
  validateCredentials: jest.fn(async (u, p) => (p === 'secret123' ? { id: 'u1', username: 'testuser' } : null)),
}));

jest.mock('../src/utils/jwt.util', () => ({
  __esModule: true,
  signAccessToken: jest.fn(async () => 'mock-token'),
}));

function makeApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(compress());
  app.use('/api/auth', authRoutes);
  return app;
}

describe('Auth Routes (supertest)', () => {
  test('POST /api/auth/register -> 201', async () => {
    const app = makeApp();
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        phone: '+15551234567',
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser',
        password: 'secret123',
      });
    expect(res.status).toBe(201);
    expect(res.body.user).toMatchObject({ id: 'u1', email: 'test@example.com', username: 'testuser' });
  });

  test('POST /api/auth/register -> 400 when invalid body', async () => {
    const app = makeApp();
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'not-an-email',
        phone: 'bad',
        firstName: '',
        lastName: '',
        username: 'a',
        password: 'x'.repeat(21),
      });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /api/auth/login -> 200 returns token', async () => {
    const app = makeApp();
    const res = await request(app)
      .post('/api/auth/login')
      .send({ usernameOrEmail: 'testuser', password: 'secret123' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ token: 'mock-token' });
  });

  test('POST /api/auth/login -> 401 invalid credentials', async () => {
    const app = makeApp();
    const res = await request(app)
      .post('/api/auth/login')
      .send({ usernameOrEmail: 'testuser', password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
