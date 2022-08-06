import { MongoClient } from 'mongodb';

export async function connectToDatabase(){
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@nextjs-blog.teiljdr.mongodb.net/${process.env.DB_HOST}?retryWrites=true&w=majority`
  );

  return client;
}
