const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.criarSubdominio = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Acesso negado'
    );
  }

  const subdominio = data.nome
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  await admin.firestore()
    .collection('subdominios')
    .doc(context.auth.uid)
    .set({
      subdominio,
      criadoEm: admin.firestore.FieldValue.serverTimestamp()
    });

  return { url: `https://${subdominio}.seusite.com` };
});