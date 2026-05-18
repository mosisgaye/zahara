import { NextRequest, NextResponse } from 'next/server';
import { PayTechClient } from '@/lib/paytech/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      msg,
      status,
      sha256Hash,
      transaction: {
        phone,
        amount,
        transactionId,
        externalTransactionId,
        callbackUrl,
        errorType
      }
    } = body;

    // Vérification de la signature PayTech
    const isValidHash = await PayTechClient.verifyCallbackHash(
      transactionId,
      externalTransactionId,
      sha256Hash,
      process.env.PAYTECH_API_KEY || ''
    );

    if (!isValidHash) {
      console.error('Hash PayTech invalide:', { externalTransactionId, sha256Hash });
      return NextResponse.json({
        success: false,
        error: 'Signature invalide'
      }, { status: 403 });
    }

    // Traitement selon le statut
    const isSuccess = status === 'SUCCESS';
    const paymentStatus = isSuccess ? 'success' : 'failed';

    // TODO: Mettre à jour la transaction en base de données
    // await updateTransactionStatus(externalTransactionId, paymentStatus, body);

    // TODO: Si succès, mettre à jour le statut de la commande
    // if (isSuccess) {
    //   await updateOrderStatus(externalTransactionId, 'confirmed');
    //   await sendConfirmationEmail(externalTransactionId);
    // }

    console.log(`PayTech Callback - Transaction ${externalTransactionId}: ${paymentStatus}`, {
      amount,
      phone,
      msg,
      errorType: isSuccess ? null : errorType
    });

    // Réponse de confirmation à PayTech
    return NextResponse.json({
      success: true,
      message: 'Callback traité avec succès',
      transactionId: externalTransactionId,
      status: paymentStatus
    });

  } catch (error) {
    console.error('Erreur callback PayTech:', error);

    return NextResponse.json({
      success: false,
      error: 'Erreur lors du traitement du callback'
    }, { status: 500 });
  }
}