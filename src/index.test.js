const request =require('supertest');
const mongoose = require('mongoose');
const app = require('./index');

beforeAll(async () => {
    await mongoose.connect('mongodb+srv://albert:albert26102003@cluster1.ecre7jl.mongodb.net/?retryWrites=true&w=majority')
               .then(() => {
                   console.log('Connected to MongoDB');
               })
               .catch((err) => {
                   console.error('Error connecting to MongoDB', err);
               });
   
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Books API', () => {
  it('should return a list of books', async () => {
    const response = await request(app)
    .get('/books')
    console.log(response)
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array); 
  });

  it('should return a book by ID', async () => {
    const bookId = '662583034116f732f71b55d9'
    const response = await request(app)
      .get('/books/id')
      .query({ id: bookId });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name');
  });

  it('should return 403 for unauthorized order', async () => {
    const response = await request(app)
      .post('/books/order')
      .send({ id: 'someValidBookId' });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Пользователь не авторизован');
  });
});
