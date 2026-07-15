import { ClientSession } from 'mongoose';
import { env, Env, EnvTypes } from '../../config/Env.ts';
import { Database, IDatabaseConnection } from '../Database.ts';
import mongoose from 'mongoose';

const databaseConfiguration = env<IDatabaseConnection>({
  [EnvTypes.developmentLike]: {
    hostname: Env.dbHost!,
    database: Env.dbName!,
    username: Env.dbUser!,
  },
  [EnvTypes.productionLike]: {
    hostname: Env.dbHost!,
    database: Env.dbName!,
    username: Env.dbUser!,
  },
  [EnvTypes.test]: {
    hostname: 'localhost',
    database: 'test',
    username: 'test',
  }
}) as IDatabaseConnection;

const database = new Database(databaseConfiguration);
export const connectionString = database.connectionString;

let _connection: any;

export const getLibraryDB = (): mongoose.Connection => {
  if (Env.isTest) {
        return {
            model: () => ({}),
            startSession: async () => ({ 
                startTransaction: () => {}, 
                commitTransaction: async () => {},
                abortTransaction: async () => {},
                endSession: () => {} 
            })
        } as any;
    }
  if (!_connection) {
    _connection = database.connect();
  }
  return _connection;
};

export const startLibrarySession = async (): Promise<ClientSession> => {
  const LibraryDB = getLibraryDB();
  const session = await LibraryDB.startSession();
  await session.startTransaction();
  return session;
};