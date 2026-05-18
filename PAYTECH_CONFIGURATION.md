# Configuration PayTech - Nooraya Voyage

## Vue d'ensemble

PayTech est intégré dans l'application Nooraya Voyage pour gérer les paiements via différents moyens de paiement sénégalais (Orange Money, Wave, cartes bancaires, etc.).

## Configuration des variables d'environnement

### Fichier `.env.local`
```bash
PAYTECH_API_KEY=0925ac9b911668fe55e8cb86738d5b45b10bb8e3ece0c10cda139af86230ff22
PAYTECH_SECRET_KEY=e4c2aacba023866f0564a934692e1ded0375c1dfc895e9be24f55c339eeb08f8
PAYTECH_API_URL=https://paytech.sn/api
PAYTECH_CALLBACK_URL=https://zwwwvztzcbkptzhfynym.supabase.co/functions/v1/paytech-callback
```

### Variables Supabase Functions
```bash
# supabase/functions/.env
PAYTECH_API_KEY=0925ac9b911668fe55e8cb86738d5b45b10bb8e3ece0c10cda139af86230ff22
```

## Architecture de l'intégration

### 1. Client PayTech (`src/lib/paytech/client.ts`)

```typescript
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

export class PayTechClient {
  private config: PayTechConfig;

  constructor(config: PayTechConfig) {
    this.config = config;
  }

  async createPayment(transaction: PayTechTransaction): Promise<PayTechResponse> {
    // Création d'une transaction PayTech
    const payload: Record<string, unknown> = {
      item_name: transaction.data?.item_name || 'Voyage',
      item_price: transaction.amount,
      currency: 'XOF',
      ref_command: transaction.externalTransactionId,
      command_name: transaction.data?.command_name || `Paiement ${transaction.externalTransactionId}`,
      ipn_url: transaction.callbackUrl || this.config.callbackUrl,
      success_url: transaction.data?.success_url || 'https://noorayavoyage.com/payment/success',
      cancel_url: transaction.data?.cancel_url || 'https://noorayavoyage.com/payment/cancel'
    };

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

    return await response.json();
  }

  async checkPaymentStatus(tokenPayment: string): Promise<PayTechResponse> {
    // Vérification du statut d'un paiement
    const response = await fetch(`${this.config.apiUrl}/payment/check-status/${tokenPayment}`, {
      method: 'GET',
      headers: {
        'API_KEY': this.config.apiKey,
        'API_SECRET': this.config.secretKey
      },
    });

    return await response.json();
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
  ORANGE_CASH_IN: 'ORANGE_SN_API_CASH_IN',
  ORANGE_CASH_OUT: 'ORANGE_SN_API_CASH_OUT',
  WAVE_CASH_IN: 'WAVE_SN_API_CASH_IN',
  WAVE_CASH_OUT: 'WAVE_SN_API_CASH_OUT',
  CARD_PAYMENT: 'BANK_CARD_API_CASH_OUT',
  WHATSAPP: 'WHATSAPP_MESSAGING'
};

// Instance singleton
export const paytechClient = new PayTechClient({
  apiKey: process.env.PAYTECH_API_KEY || '',
  secretKey: process.env.PAYTECH_SECRET_KEY || '',
  apiUrl: process.env.PAYTECH_API_URL || 'https://paytech.sn/api',
  callbackUrl: process.env.PAYTECH_CALLBACK_URL || ''
});
```

### 2. Hook React (`src/hooks/usePayTechPayment.ts`)

```typescript
interface PaymentData {
  phone: string;
  amount: number;
  paymentMethod: 'orange_money' | 'wave' | 'card' | 'whatsapp';
  bookingId?: string;
  bookingType?: 'flight' | 'hotel' | 'package';
  metadata?: Record<string, unknown>;
}

export function usePayTechPayment(options: UsePayTechPaymentOptions = {}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  const initiatePayment = useCallback(async (paymentData: PaymentData) => {
    // Appel de l'API pour créer une transaction
    const response = await fetch('/api/paytech/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });

    // Gestion de la redirection ou du polling
    if (url) {
      if (paymentData.paymentMethod === 'card') {
        window.open(url, '_blank');
      } else {
        window.location.href = url;
      }
    }

    // Polling pour vérifier le statut
    const pollInterval = setInterval(async () => {
      const statusResponse = await fetch(`/api/paytech/status?transactionId=${txId}&token=${paymentToken}`);
      const statusData = await statusResponse.json();

      if (statusData.status === 'completed') {
        clearInterval(pollInterval);
        setStatus('success');
        onSuccess?.(txId);
      } else if (statusData.status === 'failed' || attempts >= maxPollingAttempts) {
        clearInterval(pollInterval);
        setStatus('failed');
        onError?.(errorMsg);
      }
    }, pollingInterval);
  }, []);

  return {
    initiatePayment,
    checkStatus,
    reset,
    isProcessing,
    transactionId,
    paymentUrl,
    status,
    error
  };
}
```

### 3. API Route - Création de transaction (`src/app/api/paytech/transaction/route.ts`)

```typescript
const transactionSchema = z.object({
  phone: z.string().min(9).max(15),
  amount: z.number().positive(),
  paymentMethod: z.string().optional(),
  bookingId: z.string().optional(),
  bookingType: z.enum(['flight', 'hotel', 'package']).optional(),
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

  return mapping[paymentMethod];
};

export async function POST(req: NextRequest) {
  // Validation des données
  const validatedData = transactionSchema.parse(body);

  // Génération d'un ID de transaction unique
  const externalTransactionId = `NV_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  // Vérification de la réservation
  const { data: existingBooking } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  // Création de l'enregistrement en base
  const paymentData = {
    id: paymentId,
    user_id: user?.id || null,
    amount: validatedData.amount,
    currency: 'XOF',
    payment_method: dbPaymentMethod,
    paytech_external_id: externalTransactionId,
    status: 'pending',
    booking_id: bookingId
  };

  // Appel à PayTech
  const response = await paytechClient.createPayment({
    phone: validatedData.phone,
    amount: validatedData.amount,
    targetPayment: getTargetPayment(validatedData.paymentMethod),
    externalTransactionId,
    data: {
      item_name: 'Réservation Nooraya Voyages',
      success_url: 'https://noorayavoyage.com/payment/success',
      cancel_url: 'https://noorayavoyage.com/booking/payment?error=cancelled'
    }
  });

  return NextResponse.json({
    success: true,
    transactionId: externalTransactionId,
    paymentToken: response.data?.token,
    paymentUrl: response.data?.redirect_url || response.data?.redirectUrl
  });
}
```

### 4. Callback PayTech (`src/app/api/paytech/callback/route.ts`)

```typescript
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Vérification de la signature API
  if (api_key_sha256) {
    const expectedApiKeyHash = crypto
      .createHash('sha256')
      .update(process.env.PAYTECH_API_KEY || '')
      .digest('hex');

    if (expectedApiKeyHash !== api_key_sha256) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // Traitement uniquement des événements "sale_complete"
  if (type_event !== 'sale_complete') {
    return NextResponse.json({ success: true, message: 'Event type not processed' });
  }

  // Mise à jour du paiement
  const { data: payment } = await supabase
    .from('payments')
    .update({
      status: 'success',
      paytech_transaction_id: token,
      callback_data: body,
      metadata: {
        payment_method: payment_method,
        client_phone: client_phone
      }
    })
    .eq('paytech_external_id', ref_command)
    .select()
    .single();

  // Mise à jour de la réservation
  if (payment?.booking_id) {
    await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.booking_id);

    // Envoi des notifications (Slack + Email)
    await sendNotifications(payment, booking);
  }

  return NextResponse.json({ success: true, message: 'Callback processed successfully' });
}
```

### 5. Callback Supabase Edge Function (`supabase/functions/paytech-callback/index.ts`)

```typescript
interface PayTechCallback {
  msg: string
  status: 'SUCCESS' | 'FAILLED'
  sha256Hash: string
  transaction: {
    phone: string
    amount: number
    transactionId: string
    externalTransactionId: string
    callbackUrl: string
    errorType?: {
      message: string
      code: string
    }
  }
}

serve(async (req) => {
  const body: PayTechCallback = await req.json()

  // Vérification SHA256
  const expectedHash = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`${transactionId}|${externalTransactionId}|${paytechApiKey}`)
  )

  if (expectedHashHex !== body.sha256Hash) {
    return new Response(JSON.stringify({ error: 'Invalid hash' }), { status: 403 });
  }

  // Mise à jour du paiement
  await supabase
    .from('payments')
    .update({
      status: body.status.toLowerCase() === 'success' ? 'success' : 'failed',
      paytech_transaction_id: transactionId,
      callback_data: body
    })
    .eq('paytech_external_id', externalTransactionId);

  // Mise à jour de la réservation
  if (payment) {
    const bookingStatus = body.status.toLowerCase() === 'success' ? 'confirmed' : 'failed'

    await supabase
      .from('bookings')
      .update({
        status: bookingStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.booking_id);
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
})
```

## Flux de paiement

1. **Initiation** : L'utilisateur sélectionne un mode de paiement et saisit ses informations
2. **Création** : L'API `/api/paytech/transaction` crée une transaction en base et appelle PayTech
3. **Redirection** : L'utilisateur est redirigé vers PayTech pour finaliser le paiement
4. **Callback** : PayTech notifie le succès/échec via le callback configuré
5. **Mise à jour** : Les statuts de paiement et réservation sont mis à jour
6. **Notifications** : Envoi d'emails et notifications Slack

## Sécurité

- **Vérification des signatures** : Tous les callbacks sont vérifiés via SHA256
- **Variables d'environnement** : Les clés API sont stockées de manière sécurisée
- **Timeout** : Les requêtes ont un timeout de 30 secondes
- **Logs** : Journalisation détaillée en développement, minimale en production

## Services de paiement supportés

- **Orange Money** (ORANGE_SN_API_CASH_IN/OUT)
- **Wave** (WAVE_SN_API_CASH_IN/OUT)
- **Cartes bancaires** (BANK_CARD_API_CASH_OUT)
- **Wizall, Free Money, Emoney** (autres opérateurs)
- **WhatsApp** (WHATSAPP_MESSAGING)

## URLs importantes

- **API PayTech** : `https://paytech.sn/api`
- **Callback URL** : `https://zwwwvztzcbkptzhfynym.supabase.co/functions/v1/paytech-callback`
- **Success URL** : `https://noorayavoyage.com/payment/success`
- **Cancel URL** : `https://noorayavoyage.com/booking/payment?error=cancelled`