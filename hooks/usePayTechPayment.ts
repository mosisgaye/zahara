'use client';

import { useState, useCallback } from 'react';

interface PaymentData {
  phone: string;
  amount: number;
  paymentMethod: 'orange_money' | 'wave' | 'card' | 'wizall' | 'free_money' | 'emoney';
  cartItems?: any[];
  metadata?: Record<string, unknown>;
}

interface UsePayTechPaymentOptions {
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
  pollingInterval?: number;
  maxPollingAttempts?: number;
}

export function usePayTechPayment(options: UsePayTechPaymentOptions = {}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);

  const {
    onSuccess,
    onError,
    pollingInterval = 3000,
    maxPollingAttempts = 40 // 2 minutes max
  } = options;

  const initiatePayment = useCallback(async (paymentData: PaymentData) => {
    setIsProcessing(true);
    setStatus('processing');
    setError(null);
    setPaymentUrl(null);
    setTransactionId(null);

    try {
      // Appel de l'API pour créer une transaction
      const response = await fetch('/api/paytech/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erreur lors de la création de la transaction');
      }

      const { transactionId: txId, paymentToken, paymentUrl: url } = result;

      setTransactionId(txId);
      setPaymentUrl(url);

      // Gestion de la redirection selon le type de paiement
      if (url) {
        if (paymentData.paymentMethod === 'card') {
          // Ouvrir dans un nouvel onglet pour les cartes bancaires
          window.open(url, '_blank');
        } else {
          // Redirection directe pour les paiements mobiles
          window.location.href = url;
        }
      }

      // Démarrer le polling pour vérifier le statut
      let attempts = 0;
      const pollInterval = setInterval(async () => {
        attempts++;

        try {
          const statusResponse = await fetch(`/api/paytech/status?transactionId=${txId}&token=${paymentToken}`);
          const statusData = await statusResponse.json();

          if (statusData.success && statusData.status === 'completed') {
            clearInterval(pollInterval);
            setStatus('success');
            setIsProcessing(false);
            onSuccess?.(txId);
          } else if (statusData.status === 'failed' || attempts >= maxPollingAttempts) {
            clearInterval(pollInterval);
            setStatus('failed');
            setIsProcessing(false);
            const errorMsg = statusData.error || 'Le paiement a échoué ou a expiré';
            setError(errorMsg);
            onError?.(errorMsg);
          }
        } catch (pollError) {
          console.error('Erreur lors de la vérification du statut:', pollError);

          if (attempts >= maxPollingAttempts) {
            clearInterval(pollInterval);
            setStatus('failed');
            setIsProcessing(false);
            const errorMsg = 'Impossible de vérifier le statut du paiement';
            setError(errorMsg);
            onError?.(errorMsg);
          }
        }
      }, pollingInterval);

    } catch (err) {
      setIsProcessing(false);
      setStatus('failed');
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [onSuccess, onError, pollingInterval, maxPollingAttempts]);

  const checkStatus = useCallback(async (txId: string, token: string) => {
    try {
      const response = await fetch(`/api/paytech/status?transactionId=${txId}&token=${token}`);
      const result = await response.json();
      return result;
    } catch (err) {
      console.error('Erreur lors de la vérification du statut:', err);
      return { success: false, error: 'Erreur lors de la vérification' };
    }
  }, []);

  const reset = useCallback(() => {
    setIsProcessing(false);
    setTransactionId(null);
    setPaymentUrl(null);
    setStatus('idle');
    setError(null);
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