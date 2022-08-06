import bcryptjs from 'bcryptjs';

export async function hashPassword(plaintTextPassword) {
  const hashedPassword = await bcryptjs.hash(plaintTextPassword, 12);
  return hashedPassword;
}

export async function verifyPassword(plaintTextPassword, hashedPassword) {
  const passwordIsValid = await bcryptjs.compare(plaintTextPassword, hashedPassword);
  return passwordIsValid;
}

export const emailIsInvalid = (email) => {
  return (!email || !email.includes('@'));
};

export const passwordIsInvalid = (password) => {
  console.log('password length: ', password.trim().length);
  return (!password || password.trim().length < 8);
};
