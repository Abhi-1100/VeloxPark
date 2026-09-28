import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserPaymentPageMobile from './user/UserPaymentPageMobile';
import UserPaymentPageDesktop from './user/UserPaymentPageDesktop';

const loadRazorpay = () => new Promise((resolve, reject) => {
  if (window.Razorpay) return resolve();
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = resolve;
  script.onerror = () => reject(new Error('Razorpay Checkout could not be loaded'));
  document.body.appendChild(script);
});

const UserPaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const vehicleData = state?.vehicleData;
  const upiConfig = state?.upiConfig;

  const handleConfirmPayment = async () => {
    if (!vehicleData || processing) return;
    setProcessing(true);
    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parkingSessionId: vehicleData.sessionId,
          source: vehicleData.source,
          plate: vehicleData.plate,
          entry: vehicleData.entry,
          exit: vehicleData.exit,
          amount: vehicleData.amount,
        }),
      });
      const order = await response.json();
      if (!response.ok) throw new Error(order.error || 'Unable to start payment');
      await loadRazorpay();
      const checkout = new window.Razorpay({
        key: order.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'VeloxPark',
        description: 'Parking Payment',
        prefill: { name: 'VeloxPark Driver' },
        theme: { color: '#FFD700' },
        handler: async (result) => {
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ parkingSessionId: order.session.sessionId, source: order.session.source, ...result }),
          });
          const verified = await verifyResponse.json();
          if (!verifyResponse.ok || !verified.verified) throw new Error(verified.error || 'Payment verification failed');
          navigate('/user/payment/success', {
            state: { vehicleData: { ...vehicleData, ...order.session, amount: verified.payment.amount }, payment: verified.payment, upiConfig },
          });
        },
        modal: { ondismiss: () => setProcessing(false) },
      });
      checkout.on('payment.failed', async (failure) => {
        await fetch('/api/payment/failed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parkingSessionId: order.session.sessionId, source: order.session.source, orderId: order.orderId, reason: failure?.error?.description }),
        }).catch(() => {});
        setProcessing(false);
        window.alert('Payment could not be completed. Please try again.');
      });
      checkout.open();
    } catch (error) {
      setProcessing(false);
      window.alert(error.message || 'Payment could not be completed.');
    }
  };

  const sharedProps = { vehicleData, upiConfig, onConfirmPayment: handleConfirmPayment };
  return (
    <>
      <div className="block lg:hidden"><UserPaymentPageMobile {...sharedProps} /></div>
      <div className="hidden lg:block"><UserPaymentPageDesktop {...sharedProps} /></div>
      {processing && <div aria-live="polite" style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: '#111', color: '#FFD700', padding: '10px 16px', borderRadius: 10 }}>Opening secure TEST Checkout…</div>}
    </>
  );
};

export default UserPaymentPage;
