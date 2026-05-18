export interface PayTechConfig {
  apiKey: string;
  secretKey: string;
  apiUrl: string;
  callbackUrl: string;
}

export interface PayTechTransaction {
  phone: string;
  amount: number;
  targetPayment?: string; // Optionnel : si non fourni, PayTech affiche toutes les options
  externalTransactionId: string;
  callbackUrl?: string;
  data?: Record<string, unknown>;
}

export interface PayTechResponse {
  success: boolean;
  data?: {
    token?: string;
    redirect_url?: string;
    redirectUrl?: string;
  };
  message?: string;
  error?: string;
}

export class PayTechClient {
  private config: PayTechConfig;

  constructor(config: PayTechConfig) {
    this.config = config;
  }

  async createPayment(transaction: PayTechTransaction): Promise<PayTechResponse> {
    // Création d'une transaction PayTech
    const payload: Record<string, unknown> = {
      item_name: transaction.data?.item_name || 'Produit ZaharaShop',
      item_price: transaction.amount,
      currency: 'XOF',
      ref_command: transaction.externalTransactionId,
      command_name: transaction.data?.command_name || `Commande ${transaction.externalTransactionId}`,
      ipn_url: transaction.callbackUrl || this.config.callbackUrl,
      success_url: transaction.data?.success_url || 'https://zaharashop.com/payment/success',
      cancel_url: transaction.data?.cancel_url || 'https://zaharashop.com/payment/cancel'
    };

    // Ajouter le targetPayment si spécifié
    if (transaction.targetPayment) {
      payload.target_payment = transaction.targetPayment;
    }

    try {
      const response = await fetch(`${this.config.apiUrl}/payment/request-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API_KEY': this.config.apiKey,
          'API_SECRET': this.config.secretKey
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000)
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || 'Erreur lors de la création du paiement'
        };
      }

      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur réseau'
      };
    }
  }

  async checkPaymentStatus(tokenPayment: string): Promise<PayTechResponse> {
    // Vérification du statut d'un paiement
    try {
      const response = await fetch(`${this.config.apiUrl}/payment/check-status/${tokenPayment}`, {
        method: 'GET',
        headers: {
          'API_KEY': this.config.apiKey,
          'API_SECRET': this.config.secretKey
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || 'Erreur lors de la vérification du statut'
        };
      }

      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur réseau'
      };
    }
  }

  static async verifyCallbackHash(
    transactionId: string,
    externalTransactionId: string,
    receivedHash: string,
    apiKey: string
  ): Promise<boolean> {
    // Vérification de la signature des callbacks
    const crypto = await import('crypto');
    const expectedHash = crypto
      .createHash('sha256')
      .update(`${transactionId}|${externalTransactionId}|${apiKey}`)
      .digest('hex');

    return expectedHash === receivedHash;
  }
}

// Services PayTech disponibles
export const PAYTECH_SERVICES = {
  ORANGE_MONEY: 'Orange Money',
  WAVE: 'Wave',
  CARD_PAYMENT: 'Carte Bancaire',
  WIZALL: 'Wizall',
  FREE_MONEY: 'Free Money',
  EMONEY: 'Emoney'
};

// Instance singleton
export const paytechClient = new PayTechClient({
  apiKey: process.env.PAYTECH_API_KEY || '',
  secretKey: process.env.PAYTECH_SECRET_KEY || '',
  apiUrl: process.env.PAYTECH_API_URL || 'https://paytech.sn/api',
  callbackUrl: process.env.PAYTECH_CALLBACK_URL || ''
});