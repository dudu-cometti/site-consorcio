// src/api/auth.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  updateProfile
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
const storage = getStorage(app);

/* ================== FUNÇÕES DE AUTENTICAÇÃO ================== */

export const cadastrarUsuario = async (email, senha, dadosUsuario) => {
  try {
    // 1. Cria usuário no Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // 2. Dados OBRIGATÓRIOS para o Firestore
    const userData = {
      nome: dadosUsuario.nome || "",
      email: user.email,
      concessionaria: dadosUsuario.concessionaria || "",
      whatsapp: dadosUsuario.whatsapp || "",
      instagram: dadosUsuario.instagram || "",
      cargo: dadosUsuario.cargo || "Vendedor",
      fotoURL: "",
      uid: user.uid,
      dataCriacao: serverTimestamp(),
      ultimaAtualizacao: serverTimestamp()
    };

    // 3. Criação no Firestore com tratamento robusto
    try {
      await setDoc(doc(db, "usuarios", user.uid), userData);
      console.log("Documento criado no Firestore para:", user.uid);
    } catch (firestoreError) {
      // Se falhar no Firestore, reverte o cadastro no Auth
      await deleteUser(auth.currentUser);
      throw new Error("Falha ao criar perfil. Cadastro revertido.");
    }

    // 4. Atualiza o perfil no Auth (opcional)
    await updateProfile(auth.currentUser, {
      displayName: dadosUsuario.nome
    });

    return { ...user, dados: userData };
    
  } catch (error) {
    console.error("Erro completo no cadastro:", error);
    throw formatAuthError(error);
  }
};

export const fazerLogin = async (email, senha) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const userData = await buscarDadosUsuario(userCredential.user.uid);
    return { ...userCredential.user, dados: userData };
  } catch (error) {
    console.error("Erro no login:", error);
    throw formatAuthError(error);
  }
};

export const loginComGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Verifica se é primeiro login
    const userDoc = await getDoc(doc(db, "usuarios", user.uid));
    if (!userDoc.exists()) {
      const userData = {
        nome: user.displayName || "Usuário Google",
        email: user.email,
        fotoURL: user.photoURL || '',
        concessionaria: '',
        whatsapp: '',
        instagram: '',
        cargo: 'Vendedor',
        dataCriacao: serverTimestamp(),
        provider: "google"
      };
      await setDoc(doc(db, "usuarios", user.uid), userData);
      return { ...user, dados: userData };
    }

    return { ...user, dados: userDoc.data() };
  } catch (error) {
    console.error("Erro no login com Google:", error);
    throw formatAuthError(error);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Erro ao deslogar:", error);
    throw new Error("Falha ao sair");
  }
};

/* ================== GERENCIAMENTO DE PERFIL ================== */

export const buscarDadosUsuario = async (userId) => {
  try {
    // 1. Verificação crítica do Firestore
    if (!db) {
      throw new Error("Banco de dados não inicializado");
    }

    // 2. Verificação do ID do usuário
    if (!userId || typeof userId !== 'string') {
      throw new Error("ID do usuário inválido");
    }

    const userRef = doc(db, "usuarios", userId);
    const userSnap = await getDoc(userRef);

    // 3. Se documento não existe, cria com dados padrão
    if (!userSnap.exists()) {
      console.warn("Perfil não encontrado, criando padrão...");
      
      const defaultData = {
        nome: "Novo Usuário",
        concessionaria: "",
        whatsapp: "",
        instagram: "",
        cargo: "Vendedor",
        fotoURL: "",
        dataCriacao: serverTimestamp(),
        ultimaAtualizacao: serverTimestamp(),
        uid: userId // Garante que o UID está incluso
      };

      try {
        await setDoc(userRef, defaultData);
        console.log("Perfil padrão criado para:", userId);
        return defaultData;
      } catch (createError) {
        console.error("Falha ao criar perfil padrão:", createError);
        throw new Error("Falha na inicialização do perfil");
      }
    }

    // 4. Retorna dados formatados
    const userData = userSnap.data();
    
    // Garante que campos obrigatórios existam
    return {
      nome: userData.nome || "Novo Usuário",
      concessionaria: userData.concessionaria || "",
      whatsapp: userData.whatsapp || "",
      instagram: userData.instagram || "",
      cargo: userData.cargo || "Vendedor",
      fotoURL: userData.fotoURL || "",
      dataCriacao: userData.dataCriacao || serverTimestamp(),
      uid: userData.uid || userId
    };

  } catch (error) {
    console.error("Erro detalhado ao buscar usuário:", {
      error: error.message,
      userId,
      stack: error.stack
    });
    
    // 5. Erro customizado para a UI
    throw new Error(
      error.code === 'permission-denied' 
        ? "Sem permissão para acessar este perfil"
        : "Falha ao carregar dados. Tente recarregar a página."
    );
  }
};



export const atualizarPerfil = async (userId, novosDados) => {
  try {
    const userRef = doc(db, "usuarios", userId);
    
    // Atualiza Firestore
    await updateDoc(userRef, {
      ...novosDados,
      ultimaAtualizacao: serverTimestamp()
    });

    // Se tiver foto, atualiza no Auth também
    if (novosDados.fotoURL && auth.currentUser) {
      await updateProfile(auth.currentUser, {
        photoURL: novosDados.fotoURL
      });
    }

    return await buscarDadosUsuario(userId);
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    throw new Error("Falha ao atualizar perfil");
  }
};

export const uploadFotoPerfil = async (userId, file) => {
  try {
    // Verifica se o arquivo é uma imagem
    if (!file.type.startsWith('image/')) {
      throw new Error("O arquivo deve ser uma imagem");
    }

    // Limita o tamanho para 2MB
    if (file.size > 2 * 1024 * 1024) {
      throw new Error("A imagem deve ter menos de 2MB");
    }

    const storageRef = ref(storage, `perfil/${userId}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    await atualizarPerfil(userId, { fotoURL: downloadURL });
    return downloadURL;
  } catch (error) {
    console.error("Erro no upload da foto:", error);
    throw new Error(error.message || "Falha ao enviar foto");
  }
};

/* ================== FUNÇÕES DE VENDAS ================== */

export const gerarLinkVendas = async (dadosVendedor) => {
  try {
    const generateLink = httpsCallable(functions, 'gerarLinkVendas');
    const result = await generateLink(dadosVendedor);
    return result.data;
  } catch (error) {
    console.error("Erro ao gerar link:", error);
    throw new Error("Falha ao gerar link de vendas");
  }
};

export const criarSubdominio = httpsCallable(functions, 'criarSubdominio');

/* ================== MONITORAMENTO ================== */

export const monitorarAuthState = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userData = await buscarDadosUsuario(user.uid);
        callback({ ...user, dados: userData });
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

/* ================== UTILITÁRIOS ================== */

const formatAuthError = (error) => {
  const messages = {
    'auth/email-already-in-use': 'Este e-mail já está cadastrado',
    'auth/invalid-email': 'E-mail inválido',
    'auth/weak-password': 'Senha deve ter no mínimo 6 caracteres',
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'auth/network-request-failed': 'Falha na conexão. Verifique sua internet'
  };
  return new Error(messages[error.code] || error.message);
};

// Exportações básicas
export { app, auth, db, functions, storage };