import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { paytechClient } from '@/lib/paytech/client';

const transactionSchema = z.object({
  phone: z.string().min(9).max(15),
  amount: z.number().positive(),
  paymentMethod: z.string().optional(),
  cartItems: z.array(z.any()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

const getTargetPayment = (paymentMethod?: string): string | undefined => {
  const mapping: Record<string, string> = {
    'orange_money': 'Orange Money',
    'wave': 'Wave',
    'card': 'Carte Bancaire',
    'wizall': 'Wizall',
    'free_money': 'Free Money',
    'emoney': 'Emoney'
  };

  return paymentMethod ? mapping[paymentMethod] : undefined;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('PayTech - Body reçu:', body);

    // Validation des données
    const validatedData = transactionSchema.parse(body);
    console.log('PayTech - Données validées:', validatedData);

    // Génération d'un ID de transaction unique
    const externalTransactionId = `ZS_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Calcul du montant total (si pas fourni, utiliser les items du panier)
    let totalAmount = validatedData.amount;
    if (validatedData.cartItems && validatedData.cartItems.length > 0) {
      totalAmount = validatedData.cartItems.reduce((sum: number, item: any) => {
        return sum + (item.price * item.quantity);
      }, 0);
    }

    // Appel à PayTech
    const response = await paytechClient.createPayment({
      phone: validatedData.phone,
      amount: totalAmount,
      targetPayment: getTargetPayment(validatedData.paymentMethod),
      externalTransactionId,
      data: {
        item_name: 'Commande ZaharaShop',
        command_name: `Commande ${externalTransactionId}`,
        success_url: `${req.nextUrl.origin}/payment/success?txId=${externalTransactionId}`,
        cancel_url: `${req.nextUrl.origin}/payment/cancel?txId=${externalTransactionId}`,
        cart_items: validatedData.cartItems,
        metadata: validatedData.metadata
      }
    });

    if (!response.success) {
      return NextResponse.json({
        success: false,
        error: response.error || 'Erreur lors de la création du paiement'
      }, { status: 400 });
    }

    // TODO: Sauvegarder la transaction en base de données si nécessaire
    // Ici vous pourriez ajouter la logique pour sauvegarder dans votre BDD

    return NextResponse.json({
      success: true,
      transactionId: externalTransactionId,
      paymentToken: response.data?.token,
      paymentUrl: response.data?.redirect_url || response.data?.redirectUrl,
      amount: totalAmount
    });

  } catch (error) {
    console.error('Erreur PayTech transaction:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Format de requête invalide',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur interne du serveur'
    }, { status: 500 });
  }
}