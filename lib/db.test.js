import { MongoClient } from 'mongodb';
import { connectToDatabase } from './db.js';
import { describe, test, vi, expect } from 'vitest';

const mockClient = {};
vi.mock('mongodb', ()=>({
  MongoClient: {
    connect: vi.fn(()=>mockClient),
  }
}));

describe('connectToDatabase/0', ()=>{
  describe('WHEN: This function is invoked,', ()=>{
    test('THEN: It returns a client object.', async ()=>{
      const result = await connectToDatabase();

      expect(result).toEqual(mockClient);
    });
  });
});
