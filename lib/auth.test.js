import { hashPassword, emailIsInvalid, passwordIsInvalid, verifyPassword } from './auth';
import { describe, expect, test, vi } from 'vitest';
import bcryptjs from 'bcryptjs';

vi.mock('bcryptjs');

describe('passwordIsInvalid/1', ()=>{
  describe('WHEN: passwordIsInvalid is invoked with a valid password,', ()=>{
    test('THEN: the function returns "false".', ()=>{

      const password = '123456789';

      const result = passwordIsInvalid(password);

      expect(result).toBeFalsy();
    });
  });
});
describe('emailIsInvalid/1', ()=>{
  describe('WHEN: emailIsInvalid is invoked with a valid email address,', ()=>{
    test('THEN: the function returns "false".', ()=>{
      const email = 'validEmail@test.com';

      const result = emailIsInvalid(email);

      expect(result).toBeFalsy();
    });
  });
  describe('GIVEN: emailIsInvalid is invoked with an invalid email address,', ()=>{
    describe('WHEN: the email address is missing,', () => {
      test.each`
        email
        ${null}
        ${undefined}
        ${''}
      `('THEN: the function returns "true".', ({ email }) => {
        const result = emailIsInvalid(email);

        expect(result).toBeTruthy();
      });
    });
    describe('WHEN: the email address does not have a "@",', () => {
      test('THEN: the function returns "true".', () => {
        const email = 'missing_the_at_character';

        const result = emailIsInvalid(email);

        expect(result).toBeTruthy();
      });
    });
  });
});
describe('hashPassword/1', ()=>{
  describe('WHEN: given a plaintext password,', ()=>{
    test('THEN: it invokes the algorithm that produces a hashed password.', async()=>{
      const mockHash = 'someHash';
      const spy = vi.spyOn(bcryptjs, 'hash').mockImplementationOnce(()=>mockHash);
      const password = 'somePassword';

      const result = await hashPassword(password);

      expect(spy).toBeCalledWith(password, 12);
      expect(result).toEqual(mockHash);
    });
  });
});
describe('verifyPassword/2', ()=>{
  describe('WHEN: given a plaintext password and a hashed password,', ()=>{
    test('THEN: It invokes the algorithm that verifies that the password is valid.', async ()=>{
      const [ password, hashedPassword ] = [ 'somePassword', 'someHash'];
      const spy = vi.spyOn(bcryptjs, 'compare').mockImplementationOnce(()=>true);

      const result = await verifyPassword(password, hashedPassword);

      expect(spy).toBeCalledWith(password, hashedPassword);
      expect(result).toBeTruthy();
    });
  });
});
