import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAJ5KpYXaDG2qjnOGWRkdfeMRk18yiLBuU",
  authDomain: "site-consorcio-comettidigital.firebaseapp.com",
  projectId: "site-consorcio-comettidigital",
  storageBucket: "site-consorcio-comettidigital.appspot.com",
  messagingSenderId: "424595067695",
  appId: "1:424595067695:web:444eef95f6a31f07ac87da"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa serviços
const db = getFirestore(app);

// Exporta apenas o necessário
export { app, db };