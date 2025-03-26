const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.atualizarMetricas = functions.firestore
  .document('clientes/{clienteId}')
  .onCreate(async (snap, context) => {
    const clienteData = snap.data();
    const vendedorId = clienteData.vendedorId;
    
    if (!vendedorId) return;

    const metricsRef = admin.firestore().doc(`metricas_vendedores/${vendedorId}`);
    
    // Atualiza contatos
    await metricsRef.set({
      contatos: admin.firestore.FieldValue.increment(1),
      ultimaAtualizacao: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // Atualiza modelo mais popular (exemplo simplificado)
    if (clienteData.modeloInteresse) {
      const modeloStatsRef = admin.firestore().doc(`modelos_stats/${clienteData.modeloInteresse}`);
      await modeloStatsRef.set({
        count: admin.firestore.FieldValue.increment(1),
        vendedorId: vendedorId
      }, { merge: true });
    }
    
    return true;
  });