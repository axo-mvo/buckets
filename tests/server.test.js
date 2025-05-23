const request = require('supertest');
const axios = require('axios');

jest.mock('axios');

let app;

beforeAll(() => {
  process.env.API_TOKEN = 'test-token';
  app = require('../server');
});

test('GET /api/buckets returns mocked bucket data', async () => {
  const sample = [{ id: 1, name: 'Sample Bucket' }];
  axios.get.mockResolvedValue({ data: sample });

  const res = await request(app).get('/api/buckets');
  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual(sample);
});
