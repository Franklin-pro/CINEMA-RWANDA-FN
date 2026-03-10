import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const paymentsService = {
  // MoMo Payment
  processMoMoPayment: async (paymentData) => {
    return api.post('/payments/momo', paymentData);
  },

  // Flutterwave Payment (Card & Bank Transfer)
  processFlutterwavePayment: async (paymentData) => {
    return api.post('/payments/flutterwave', paymentData);
  },

  // Verify Flutterwave transaction
  verifyFlutterwaveTransaction: async (transactionId) => {
    return api.get(`/payments/flutterwave/verify/${transactionId}`);
  },

  // PayPal Payment
  processPayPalPayment: async (paymentData) => {
    return api.post('/payments/paypal', paymentData);
  },

  // Check MoMo payment status
  checkMoMoPaymentStatus: async (transactionId) => {
    return api.get(`/payments/momo/status/${transactionId}`);
  },

  // Subscription Payments
  processSubscriptionMomoPayment: async (subscriptionData) => {
    return api.post('/payments/subscription/momo', subscriptionData);
  },

  processSubscriptionFlutterwavePayment: async (subscriptionData) => {
    return api.post('/payments/subscription/flutterwave', subscriptionData);
  },

  // Payment History
  getPaymentHistory: async (userId, params = {}) => {
    return api.get(`/payments/user/${userId}`, { params });
  },

  // Payment Details
  getPaymentDetails: async (paymentId) => {
    return api.get(`/payments/status/${paymentId}`);
  },

  // Withdrawal
  getWithdrawalHistory: async (params = {}) => {
    return api.get('/payments/withdrawals/history', { params });
  },

  getWithdrawalDetails: async (withdrawalId) => {
    return api.get(`/payments/withdrawals/${withdrawalId}`);
  },
};

export default paymentsService;
