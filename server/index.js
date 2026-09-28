/* global process */
import 'dotenv/config';
import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'node:crypto';
import { firebaseDb } from './firebase.js';
import { findParkingSession } from './parking.js';

const app = express();
const port = Number(process.env.PORT || 5050);
const keyId = process.env.RAZORPAY_KEY_ID;
const secret = process.env.RAZORPAY_KEY_SECRET;
if (!keyId || !secret) throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are required');
if (!keyId.startsWith('rzp_test_')) throw new Error('Only Razorpay TEST keys are allowed');
const razorpay = new Razorpay({ key_id: keyId, key_secret: secret });

app.use(express.json({ limit: '32kb' }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_ORIGIN || 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

const paymentPath = (s) => s.source === 'parkingLogs' ? 'parkingLogs/' + s.sessionId + '/payment' : 'parkingPayments/' + s.sessionId;
const publicPayment = (p) => ({ status: p.status, amount: p.amount, currency: p.currency, razorpayOrderId: p.razorpayOrderId || null, razorpayPaymentId: p.razorpayPaymentId || null, paidAt: p.paidAt || null });

app.get('/api/health', (req, res) => res.json({ ok: true, mode: 'test' }));

app.post('/api/payment/create-order', async (req, res) => {
  try {
    const session = await findParkingSession(firebaseDb, req.body);
    if (!session.exit) return res.status(400).json({ error: 'Payment is available only after vehicle exit' });
    const path = paymentPath(session);
    const existing = (await firebaseDb.ref(path).once('value')).val() || {};
    if (existing.status === 'paid') return res.status(409).json({ error: 'This parking session is already paid', payment: publicPayment(existing) });
    const order = await razorpay.orders.create({
      amount: Math.round(session.amount * 100), currency: 'INR',
            receipt: 'veloxpark_' + String(session.sessionId).slice(-24),
      notes: { parkingSessionId: session.sessionId, plate: session.plate },
    });
    await firebaseDb.ref(path).set({ status: 'pending', amount: session.amount, currency: 'INR', razorpayOrderId: order.id, createdAt: new Date().toISOString() });
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId, session });
  } catch (error) {
    console.error('[payment/create-order]', error.message);
    res.status(error.message.includes('required') || error.message.includes('found') ? 400 : 500).json({ error: 'Unable to create payment order' });
  }
});

app.post('/api/payment/verify', async (req, res) => {
  const { parkingSessionId, source, razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body || {};
  try {
    if (!parkingSessionId || !orderId || !paymentId || !signature) return res.status(400).json({ error: 'Incomplete payment verification data' });
    const path = source === 'parkingLogs' ? 'parkingLogs/' + parkingSessionId + '/payment' : 'parkingPayments/' + parkingSessionId;
    const ref = firebaseDb.ref(path); const payment = (await ref.once('value')).val();
    if (!payment || payment.razorpayOrderId !== orderId) return res.status(400).json({ error: 'Payment order does not match the parking session' });
    if (payment.status === 'paid') return res.json({ verified: true, payment: publicPayment(payment) });
        const expected = crypto.createHmac('sha256', secret).update(orderId + '|' + paymentId).digest('hex');
    const valid = expected.length === signature.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
    if (!valid) { console.warn('[payment/verify] signature mismatch'); return res.status(400).json({ error: 'Payment verification failed' }); }
    const paidAt = new Date().toISOString();
    await ref.update({ status: 'paid', razorpayPaymentId: paymentId, paidAt });
    res.json({ verified: true, payment: publicPayment({ ...payment, status: 'paid', razorpayPaymentId: paymentId, paidAt }) });
  } catch (error) {
    console.error('[payment/verify]', error.message);
    res.status(500).json({ error: 'Unable to verify payment' });
  }
});

app.post('/api/payment/failed', async (req, res) => {
  const { parkingSessionId, source, orderId, reason } = req.body || {};
  try {
    const path = source === 'parkingLogs' ? 'parkingLogs/' + parkingSessionId + '/payment' : 'parkingPayments/' + parkingSessionId;
    const ref = firebaseDb.ref(path); const payment = (await ref.once('value')).val();
    if (!payment || payment.razorpayOrderId !== orderId) return res.status(400).json({ error: 'Payment order does not match the parking session' });
    if (payment.status !== 'paid') await ref.update({ status: 'failed', failureReason: String(reason || 'Payment failed').slice(0, 160), failedAt: new Date().toISOString() });
    res.json({ recorded: true });
  } catch (error) {
    console.error('[payment/failed]', error.message);
    res.status(500).json({ error: 'Unable to record payment failure' });
  }
});

app.listen(port, () => console.log('VeloxPark payment server listening on http://localhost:' + port + ' (Razorpay TEST mode)'));






