import request from 'supertest';
import server from '../src/server';

jest.useFakeTimers();

describe('a simple test to see if everything is ok with server', () => {
  it('responds to /', async () => {
    request(server).get('/').expect(200);
  });
});
