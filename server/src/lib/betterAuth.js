import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';
import { config } from '../config/index.js';

let authInstance = null;

export const getAuth = () => {
  if (!authInstance) {
    try {
      const client = new MongoClient(config.mongodbUri, {
        serverSelectionTimeoutMS: 3000,
      });
      const db = client.db();

      authInstance = betterAuth({
        database: mongodbAdapter(db),
        secret: config.betterAuthSecret,
        baseURL: config.betterAuthUrl,
        emailAndPassword: {
          enabled: true,
          autoSignIn: true,
        },
        user: {
          additionalFields: {
            role: {
              type: 'string',
              defaultValue: 'CLIENT',
              input: false, // Never trust role from frontend request
            },
            clientId: {
              type: 'string',
              required: false,
            },
          },
        },
        trustedOrigins: [config.clientUrl, 'http://localhost:3000'],
      });
    } catch (err) {
      console.warn('[Better Auth Warning] Could not connect Better Auth to MongoDB:', err.message);
    }
  }
  return authInstance;
};
