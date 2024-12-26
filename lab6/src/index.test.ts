import request from 'supertest';
import express from 'express';
import authRouter from './components/routes/auth_router/authRouter'; // adjust the path as necessary

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

const mockUser = {
  username: 'testuser',
  birthday: '1990-01-01',
  email: 'test@example.com',
  password: 'password123',
};

describe('Auth API Tests', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/auth/registration')
      .send(mockUser);
    console.log(response)
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Registration succesfully');
  });

  it('should not register an existing user', async () => {
    const response = await request(app)
      .post('/auth/registration')
      .send(mockUser);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Такой пользователь уже существует');
  });

  it('should log in the user and send verification code', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: mockUser.email, password: mockUser.password });

    expect(response.status).toBe(200);
    expect(response.text).toBe('ok'); 
  });

  it('should verify the code and return tokens', async () => {
    const response = await request(app).post('/auth/verify').send({
      email: mockUser.email,
      code: '123456' // Replace with the actual code sent to the user's email
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });

  it('should verify the access token', async () => {
    const tokenResponse = await request(app).post('/auth/verify').send({
      email: mockUser.email,
      code: '123456' // Use the correct code here
    });

    const accessToken = tokenResponse.body.accessToken;

    const response = await request(app)
      .post('/auth/check')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('ok');
  });

  it('should update tokens', async () => {
    const tokenResponse = await request(app).post('/auth/verify').send({
      email: mockUser.email,
      code: '123456' // Use the correct code here
    });

    const refreshToken = tokenResponse.body.refreshToken;

    const response = await request(app)
      .put('/auth/update')
      .set('Authorization', `Bearer ${refreshToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });
});