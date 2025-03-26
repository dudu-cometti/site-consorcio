// src/api/auth.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { 
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';



// Configuração do Firebase (substitua se necessário)
const firebaseConfig = {
  apiKey: "AIzaSyAJ5KpYXaDG2qjnOGWRkdfeMRk18yiLBuU",
  authDomain: "site-consorcio-comettidigital.firebaseapp.com",
  projectId: "site-consorcio-comettidigital",
  storageBucket: "site-consorcio-comettidigital.appspot.com",
  messagingSenderId: "424595067695",
  appId: "1:424595067695:web:444eef95f6a31f07ac87da"
};

// Inicializações
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// autenticacao com o gogle 
export const loginComGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // Dados adicionais do usuário
    const user = {
      uid: result.user.uid,
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL
    };
    return user;
  } catch (error) {
    console.error("Erro no login com Google:", error);
    throw error;
  }
};

// Funções de Autenticação
export const cadastrarUsuario = async (email, senha, dadosUsuario) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    await setDoc(doc(db, "usuarios", user.uid), {
      ...dadosUsuario,
      uid: user.uid,
      dataCriacao: new Date()
    });

    return user;
  } catch (error) {
    console.error("Erro no cadastro:", error);
    throw error;
  }
};

export const fazerLogin = async (email, senha) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    return userCredential.user;
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erro ao deslogar:", error);
    throw error;
  }
};

// Funções do Firestore
export const buscarDadosUsuario = async (userId) => {
  try {
    const docRef = doc(db, "usuarios", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
};

// Funções do Cloud Functions
export const criarSubdominio = httpsCallable(functions, 'criarSubdominio');

// Monitoramento de autenticação
export const monitorarAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Exportações básicas
export { app, auth, db, functions };