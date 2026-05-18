import { NextRequest, NextResponse } from 'next/server';
import { paytechClient } from '@/lib/paytech/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const transactionId = searchParams.get('transactionId');
    const token = searchParams.get('token');

    if (!transactionId || !token) {
      return NextResponse.json({
        success: false,
        error: 'Paramètres manquants'
      }, { status: 400 });
    }

    // Vérification du statut via PayTech
    const response = await paytechClient.checkPaymentStatus(token);

    if (!response.success) {
      return NextResponse.json({
        success: false,
        error: response.error || 'Erreur lors de la vérification du statut'
      }, { status: 400 });
    }

    // TODO: Vérifier aussi le statut en base de données si nécessaire
    // const dbStatus = await checkTransactionInDatabase(transactionId);

    // Mappage des statuts PayTech
    const mapPayTechStatus = (paytechData: any) => {
      if (paytechData?.status === 'completed' || paytechData?.status === 'success') {
        return 'completed';
      } else if (paytechData?.status === 'failed' || paytechData?.status === 'cancelled') {
        return 'failed';
      } else {
        return 'pending';
      }
    };

    const status = mapPayTechStatus(response.data);

    return NextResponse.json({
      success: true,
      transactionId,
      status,
      payTechData: response.data
    });

  } catch (error) {
    console.error('Erreur vérification statut PayTech:', error);

    return NextResponse.json({
      success: false,
      error: 'Erreur interne du serveur'
    }, { status: 500 });
  }
}