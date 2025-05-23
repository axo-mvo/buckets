const request = require('supertest');
const axios = require('axios');

// set fake API token so server does not exit
process.env.API_TOKEN = 'test-token';

jest.mock('axios');

const app = require('../server');

describe('GET /api/buckets', () => {
  it('returns mocked bucket data', async () => {
    const mockData = [{ id: 1, name: 'Bucket A' }];
    axios.get.mockResolvedValue({ data: mockData });

    const res = await request(app).get('/api/buckets');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockData);
  });
});
