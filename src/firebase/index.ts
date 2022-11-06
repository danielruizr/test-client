import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

export const firebaseApp = initializeApp({}); // TODO add int

export const firebaseAuth = getAuth(firebaseApp);

export const firebaseStorage = getStorage(firebaseApp);
