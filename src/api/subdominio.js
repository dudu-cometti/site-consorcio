import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from './auth'; // Sua configuração do Firebase

// Função para gerar subdomínio
export const gerarSubdominio = async (userId, nomeUsuario) => {
  try {
    // 1. Normaliza o nome para criar subdomínio (ex: "João Silva" → "joao-silva")
    const subdominio = nomeUsuario
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/[^a-z0-9-]/g, ''); // Remove caracteres especiais

    // 2. Registra no Firestore
    const db = getFirestore();
    await setDoc(doc(db, 'subdominios', userId), {
      subdominio,
      nomeUsuario,
      createdAt: new Date()
    });

    // 3. Chama Cloud Function para configurar DNS (opcional)
    const criarSubdominio = httpsCallable(functions, 'criarSubdominio');
    await criarSubdominio({ subdominio });

    return subdominio;
  } catch (error) {
    console.error("Erro ao gerar subdomínio:", error);
    throw error;
  }
};