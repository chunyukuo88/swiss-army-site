import { connectToDatabase } from '../../../lib/db';
import { emailIsInvalid, hashPassword, passwordIsInvalid } from '../../../lib/auth';

export default async function signupHandler(req, res) {
  if (req.method !== 'POST') return;
  if (inputsAreInvalid(req)) return postError(res, messages.ERROR_INVALID_INPUT);
  const client = await connectToDatabase();
  await checkIfUserAlreadyExists(client, req, res);
  await addNewUserToDatabase(client, req, res);
  await client.close();
}

export const messages = {
  ERROR_INVALID_INPUT: 'Invalid input. Note that passwords should be at least 8 characters long.',
  ERROR_USER_ALREADY_EXISTS: 'That user already exists.',
  SUCCESS_USER_CREATED: 'User has been created.',
};

const checkIfUserAlreadyExists = async (client, req, res) => {
  const db = client.db();
  const existingUser = await db.collection('users').findOne({ email: req.body.email });
  if (existingUser) {
    await client.close();
    return postError(res, `That user exists: ${existingUser}`);
  }
};

const addNewUserToDatabase = async (client, req, res) => {
  const db = client.db();
  const { email, password } = req.body;
  const hashedPassword = hashPassword(password);
  await db.collection('users').insertOne({
    email: email,
    password: hashedPassword,
  });
  res.status(201).json({ message: messages.SUCCESS_USER_CREATED });
};

const inputsAreInvalid = (req) => {
  const { email, password } = req.body;
  if (!password || !email) return true;
  return (emailIsInvalid(email) || passwordIsInvalid(password));
};

const postError = (res, msg) => {
  res.status(422).json({
    message: msg,
  });
  return;
}
