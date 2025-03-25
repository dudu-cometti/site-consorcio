import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Configuração do Firebase (substitua pelos seus dados)
const firebaseConfig = {
  apiKey: "AIzaSyAJ5KpYXaDG2qjnOGWRkdfeMRk18yiLBuU",
  authDomain: "site-consorcio-comettidigital.firebaseapp.com",
  projectId: "site-consorcio-comettidigital",
  storageBucket: "site-consorcio-comettidigital.firebasestorage.app",
  messagingSenderId: "424595067695",
  appId: "1:424595067695:web:444eef95f6a31f07ac87da"
};

const functions = getFunctions(app);

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Função para cadastrar um novo usuário
export const cadastrarUsuario = async (email, senha, dadosUsuario) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // Salva os dados do usuário no Firestore
    await setDoc(doc(db, "usuarios", user.uid), {
      nome: dadosUsuario.nome,
      telefone: dadosUsuario.telefone,
      empresa: dadosUsuario.empresa,
      instagram: dadosUsuario.instagram,
      foto: dadosUsuario.foto,
      classe: dadosUsuario.classe,
    });

    return user;
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    throw error;
  }
};

// Função para fazer login
export const fazerLogin = async (email, senha) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    return userCredential.user;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

// Função para buscar dados do usuário
export const buscarDadosUsuario = async (userId) => {
  try {
    const docRef = doc(db, "usuarios", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("Usuário não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    throw error;
  }
};
export {app, auth, db, functions

}