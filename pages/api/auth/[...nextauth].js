import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDatabase } from '../../../lib/db';
import { verifyPassword } from '../../../lib/auth';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: {
          label: 'email',
          type: 'email',
        },
        password: {
          label: 'password',
          type: 'password'
        },
        async authorize(credentials){
          const client = await connectToDatabase();
          const usersCollection = client.db().collection('users');
          const user = await usersCollection.findOne({
            email: credentials.email,
          });

          if (!user) errorAndClose(client,'No user found!');
          const isValid = await verifyPassword(credentials.password, user.password);
          if (!isValid) errorAndClose(client,'Unable to log in.');

          // await client.close();
          return { email: user.email };
        }
      },
      callbacks: {
        jwt: () => {},
        session: () => {},
      },
      secret: 'test',
      jwt: {
        secret: 'test',
        encryption: true,
      },
    })
  ]
});

const errorAndClose = (client, message) => {
  // client.close();
  throw new Error(message);
};
