/* global process */
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { readFileSync } from 'node:fs';
import { getDatabase } from 'firebase-admin/database';

const databaseURL = process.env.FIREBASE_DATABASE_URL;
if (!databaseURL) throw new Error('FIREBASE_DATABASE_URL is required for the payment server');

let credential;
if (process.env.FIREBASE_SERVICE_ACCOUNT_FILE) {
  try { credential = cert(JSON.parse(readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_FILE, 'utf8'))); }
  catch { throw new Error('FIREBASE_SERVICE_ACCOUNT_FILE must point to valid service-account JSON'); }
} else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try { credential = cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)); }
  catch { throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON must contain valid service-account JSON'); }
} else {
  credential = applicationDefault();
}

if (!getApps().length) initializeApp({ credential, databaseURL });
export const firebaseDb = getDatabase();

