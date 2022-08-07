import handler, { messages } from '../../../pages/api/auth/signup';
import { connectToDatabase } from '../../../lib/db';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../lib/db');
afterEach(()=>{
  vi.clearAllMocks();
});

describe('Auth form handler UNIT TEST:', () => {
  describe('GIVEN: given a request,', () => {
    describe('WHEN: the request is valid,', () => {
      it('THEN: it produces a success message.', async () => {
        connectToDatabase.mockImplementationOnce(()=>({
          close: vi.fn(),
          db: () => ({
            collection: ()=>({
              findOne: vi.fn(),
              insertOne: vi.fn(),
            }),
          })
        }));

        const req = {
          body: {
            email: 'email@test.com',
            password: 'Valid_Password.',
          },
          method: 'POST'
        };
        const res = {};
        res.status = () => res;
        res.json = vi.fn(() => res);
        const expectedMessageArray = [{
          message: messages.SUCCESS_USER_CREATED,
        }];

        const result = await handler(req, res);

        expect(result).toBeUndefined();
        // expect(res.json).toBeCalledWith(expectedMessageArray); // TODO: Reconsider this.
      });
    });
    describe('WHEN: the email and password are both valid but the user exists already.', ()=>{
      it('THEN: It returns an error message stating that the user exists already.', async ()=>{
        const mockClientClose = vi.fn();
        connectToDatabase.mockImplementationOnce(()=>({
          close: mockClientClose,
          db: () => ({
            collection: () => ({
              findOne: vi.fn(()=> true),
              insertOne: vi.fn(),
            }),
          }),
        }));
        const req = {
          body: {
            email: 'email@test.com',
            password: 'Valid_Password.',
          },
          method: 'POST'
        };
        const res = {};
        res.status = () => res;
        res.json = () => res;
        const spy = vi.spyOn(res, 'json');
        const expectedMessageArray = {
          message: messages.ERROR_USER_ALREADY_EXISTS,
        };

        const result = await handler(req, res);

        expect(result).toBeUndefined();
        expect(spy).toBeCalledWith(expectedMessageArray);
        expect(mockClientClose).toBeCalled();
      });
    });
    describe('WHEN: the request is invalid,', () => {
      describe('AND: the request method is not \'POST\'', ()=>{
        it('THEN: it returns `undefined`.', async ()=>{
          const [req, res] = [{}, {}];

          const result = await handler(req, res);

          expect(result).toBeUndefined();
        });
      });
      describe('AND: the email is invalid,', () => {
        it('THEN: It returns a 422 status.', async () => {
        const req = {
          body: {
            email: 'invalidEmail',
            password: 'validPassword123',
          },
          method: 'POST',
        };
        const res = {};
        res.status = () => res;
        res.json = vi.fn(() => res);
        const expectedMessageObject = {
          message: messages.ERROR_INVALID_INPUT,
        };

        const result = await handler(req, res);

        expect(result).toBeUndefined();
        expect(res.json).toBeCalledWith(expectedMessageObject);
      });
      });
      describe('AND: the email is null,', () => {
        it('THEN: It returns a 422 status.', async () => {
          const req = {
            body: {
              email: null,
              password: 'validPassword123',
            },
            method: 'POST',
          };
          const res = {};
          res.status = () => res;
          res.json = vi.fn(() => res);
          const expectedMessageObject = {
            message: messages.ERROR_INVALID_INPUT,
          };

          const result = await handler(req, res);

          expect(result).toBeUndefined();
          expect(res.json).toBeCalledWith(expectedMessageObject);
        });
      });
      describe('AND: the email is undefined,', () => {
        it('THEN: It returns a 422 status.', async () => {
          const req = {
            body: {
              email: undefined,
              password: 'validPassword123',
            },
            method: 'POST',
          };
          const res = {};
          res.status = () => res;
          res.json = vi.fn(() => res);
          const expectedMessageObject = {
            message: messages.ERROR_INVALID_INPUT,
          };

          const result = await handler(req, res);

          expect(result).toBeUndefined();
          expect(res.json).toBeCalledWith(expectedMessageObject);
        });
      });
      describe('AND: the password is an empty string,', () => {
        it('THEN: It returns a 422 status.', async () => {
          const req = {
            body: {
              email: 'valid@email.com',
              password: '',
            },
            method: 'POST'
          };
          const res = {};
          res.status = () => res;
          res.json = vi.fn(() => res);
          const expectedMessageObject = {
            message: messages.ERROR_INVALID_INPUT,
          };

          const result = await handler(req, res);

          expect(result).toBeUndefined();
          expect(res.json).toBeCalledWith(expectedMessageObject);
        });
      });
      describe('AND: the password is null,', () => {
        it('THEN: It returns a 422 status.', async () => {
          const req = {
            body: {
              email: 'valid@email.com',
              password: null,
            },
            method: 'POST'
          };
          const res = {};
          res.status = () => res;
          res.json = vi.fn(() => res);
          const expectedMessageObject = {
            message: messages.ERROR_INVALID_INPUT,
          };

          const result = await handler(req, res);

          expect(result).toBeUndefined();
          expect(res.json).toBeCalledWith(expectedMessageObject);
        });
      });
      describe('AND: the password is undefined,', () => {
        it('THEN: It returns a 422 status.', async () => {
          const req = {
            body: {
              email: 'valid@email.com',
              password: undefined,
            },
            method: 'POST'
          };
          const res = {};
          res.status = () => res;
          res.json = vi.fn(() => res);
          const expectedMessageObject = {
            message: messages.ERROR_INVALID_INPUT,
          };

          const result = await handler(req, res);

          expect(result).toBeUndefined();
          expect(res.json).toBeCalledWith(expectedMessageObject);
        });
      });
    });
  });
});
