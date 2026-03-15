import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  AlertCircle, 
  CheckCircle, 
  Loader, 
  Phone, 
  Building2, 
  Globe, 
  Shield, 
  Smartphone,
  ArrowLeft,
  Wallet,
  Clock
} from 'lucide-react';
import filmmmakerService from '../../services/api/filmmaker';

function PaymentMethodSetup() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showCurrentMethod, setShowCurrentMethod] = useState(true);

  const [formData, setFormData] = useState({
    // MoMo
    momoPhoneNumber: '',
    // Bank Transfer
    bankAccountHolder: '',
    bankName: '',
    accountNumber: '',
    accountType: 'checking',
    routingNumber: '',
    swiftCode: '',
    country: 'RW',
    // Stripe
    stripeAccountId: '',
    paymentMethod: 'momo', // 'momo', 'bank_transfer', 'stripe'
  });

  useEffect(() => {
    fetchPaymentMethod();
  }, []);

  const fetchPaymentMethod = async () => {
    try {
      setLoading(true);
      const response = await filmmmakerService.getPaymentMethod();
      if (response.data) {
        setPaymentMethod(response.data.data);

        // Map backend response to form data
        const newFormData = { ...formData };
        newFormData.paymentMethod = response.data.currentMethod || 'momo';

        // Extract MoMo details
        if (response.data.paymentDetails?.momo) {
          newFormData.momoPhoneNumber = response.data.paymentDetails.momo;
        }

        // Extract Bank details
        if (response.data.paymentDetails?.allMethods?.bankDetails) {
          const bankDetails = response.data.paymentDetails.allMethods.bankDetails;
          newFormData.bankAccountHolder = bankDetails.accountName || '';
          newFormData.bankName = bankDetails.bankName || '';
          newFormData.accountNumber = bankDetails.accountNumber || '';
          newFormData.accountType = bankDetails.accountType || 'checking';
          newFormData.routingNumber = bankDetails.routingNumber || '';
          newFormData.swiftCode = bankDetails.swiftCode || '';
          newFormData.country = bankDetails.country || 'RW';
        }

        // Extract Stripe details
        if (response.data.paymentDetails?.allMethods?.stripeAccountId) {
          newFormData.stripeAccountId = response.data.paymentDetails.allMethods.stripeAccountId;
        }

        setFormData(newFormData);
      }
    } catch (err) {
      console.error('Error fetching payment method:', err);
      setError('Failed to load payment method');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError(null);
    setSuccess(null);
  };

  const validateForm = () => {
    if (formData.paymentMethod === 'momo') {
      if (!formData.momoPhoneNumber) {
        setError('Please enter your MoMo phone number');
        return false;
      }
      
      // Remove any spaces or special characters
      const cleanedNumber = formData.momoPhoneNumber.replace(/\s+/g, '');
      
      // Validate Rwandan phone number format (078XXXXXXX or 079XXXXXXX)
      const rwandanPhoneRegex = /^(078|079)\d{7}$/;
      if (!rwandanPhoneRegex.test(cleanedNumber)) {
        setError('Please enter a valid MTN MoMo number starting with 078 or 079 (e.g., 0781234567)');
        return false;
      }
      
      // Check length
      if (cleanedNumber.length !== 10) {
        setError('Phone number must be exactly 10 digits (e.g., 0781234567)');
        return false;
      }
    } else if (formData.paymentMethod === 'bank_transfer') {
      if (!formData.bankAccountHolder) {
        setError('Please enter the account holder name');
        return false;
      }
      if (!formData.bankName) {
        setError('Please enter the bank name');
        return false;
      }
      if (!formData.accountNumber) {
        setError('Please enter the account number');
        return false;
      }
      if (formData.accountNumber.length < 8) {
        setError('Account number must be at least 8 characters');
        return false;
      }
    } else if (formData.paymentMethod === 'stripe') {
      if (!formData.stripeAccountId) {
        setError('Please enter your Stripe account ID');
        return false;
      }
      if (!formData.stripeAccountId.startsWith('acct_')) {
        setError('Stripe account ID must start with "acct_"');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Build payload with only the relevant fields for the selected payment method
      let payload = {
        payoutMethod: formData.paymentMethod,
      };

      if (formData.paymentMethod === 'momo') {
        // Clean the phone number
        const cleanedNumber = formData.momoPhoneNumber.replace(/\s+/g, '');
        payload.momoPhoneNumber = cleanedNumber;
      } else if (formData.paymentMethod === 'bank_transfer') {
        payload.bankAccountHolder = formData.bankAccountHolder;
        payload.bankName = formData.bankName;
        payload.accountNumber = formData.accountNumber;
        payload.accountType = formData.accountType;
        payload.routingNumber = formData.routingNumber;
        payload.swiftCode = formData.swiftCode;
        payload.country = formData.country;
      } else if (formData.paymentMethod === 'stripe') {
        payload.stripeAccountId = formData.stripeAccountId;
      }

      const response = await filmmmakerService.updatePaymentMethod(payload);

      if (response.data) {
        setPaymentMethod(response.data);
        setSuccess('Payment method updated successfully! It will be verified within 24-48 hours.');
        
        // Refresh payment method data
        await fetchPaymentMethod();
        
        setTimeout(() => {
          navigate('/dashboard/filmmaker');
        }, 3000);
      }
    } catch (err) {
      console.error('Error updating payment method:', err);
      setError(err.response?.data?.message || 'Failed to update payment method');
    } finally {
      setSaving(false);
    }
  };

  const formatPhoneNumber = (value) => {
    // Format phone number as user types (XXX XXX XXX)
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({
      ...formData,
      momoPhoneNumber: formatted,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-yellow-500" />
          <p className="text-gray-400">Loading payment method...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white px-4 py-8">
      <div className="max-w-3xl pt-16 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard/filmmaker')}
            className="text-yellow-500 hover:text-yellow-400 mb-4 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Wallet className="w-8 h-8 text-yellow-500" />
            </div>
            Payment Method Setup
          </h1>
          <p className="text-gray-400">Add or update your payment method to receive payouts from content sales</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-500/10 border border-green-500/50 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-200 font-medium">{success}</p>
              <p className="text-green-300 text-sm mt-1">Redirecting to dashboard...</p>
            </div>
          </div>
        )}

        {/* Current Payment Method */}
        {paymentMethod && showCurrentMethod && (
          <div className="mb-8 bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Current Payment Method
              </h2>
              <button
                onClick={() => setShowCurrentMethod(false)}
                className="text-gray-400 hover:text-gray-300 text-sm"
              >
                Hide
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  paymentMethod.verificationStatus?.bankDetails
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {paymentMethod.verificationStatus?.bankDetails ? 'Verified' : 'Pending Verification'}
                </span>
                <span className="text-sm text-gray-400">
                  Added {paymentMethod.verificationStatus?.lastVerified 
                    ? new Date(paymentMethod.verificationStatus.lastVerified).toLocaleDateString()
                    : 'recently'}
                </span>
              </div>

              <div className="bg-gray-800/40 rounded-lg p-4 space-y-2">
                <p className="text-sm">
                  <span className="text-gray-500">Method:</span>{' '}
                  <span className="text-white font-medium capitalize">
                    {paymentMethod.currentMethod?.replace('_', ' ')}
                  </span>
                </p>
                
                {paymentMethod.currentMethod === 'momo' && paymentMethod.paymentDetails?.momo && (
                  <p className="text-sm">
                    <span className="text-gray-500">Phone Number:</span>{' '}
                    <span className="text-white font-mono">{paymentMethod.paymentDetails.momo}</span>
                  </p>
                )}
                
                {paymentMethod.currentMethod === 'bank_transfer' && paymentMethod.paymentDetails?.allMethods?.bankDetails && (
                  <>
                    <p className="text-sm">
                      <span className="text-gray-500">Bank:</span>{' '}
                      <span className="text-white">{paymentMethod.paymentDetails.allMethods.bankDetails.bankName}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500">Account Holder:</span>{' '}
                      <span className="text-white">{paymentMethod.paymentDetails.allMethods.bankDetails.accountName}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500">Account:</span>{' '}
                      <span className="text-white font-mono">
                        •••• {paymentMethod.paymentDetails.allMethods.bankDetails.accountNumber?.slice(-4)}
                      </span>
                    </p>
                  </>
                )}
              </div>

              {!paymentMethod.verificationStatus?.bankDetails && (
                <div className="flex items-center gap-2 text-sm text-yellow-400 bg-yellow-500/10 rounded-lg p-3">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <p>Your payment method is awaiting verification. You'll receive payouts once verified.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Type Selection */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Select Payment Method</h2>

            <div className="space-y-3">
              {/* MoMo - Primary Option for Rwanda */}
              <label className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                formData.paymentMethod === 'momo'
                  ? 'bg-yellow-500/10 border-yellow-500/50 shadow-lg shadow-yellow-500/5'
                  : 'border-gray-700 hover:border-gray-600 hover:bg-gray-700/30'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="momo"
                  checked={formData.paymentMethod === 'momo'}
                  onChange={handleChange}
                  className="mt-1 accent-yellow-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Smartphone className="w-5 h-5 text-yellow-500" />
                    <p className="font-semibold text-white">MTN Mobile Money (MoMo)</p>
                    {formData.paymentMethod === 'momo' && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">Fastest payouts • Direct to your phone • No bank account needed</p>
                </div>
              </label>

              {/* Bank Transfer - Commented out as per your request */}
              {/* <label className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                formData.paymentMethod === 'bank_transfer'
                  ? 'bg-yellow-500/10 border-yellow-500/50 shadow-lg shadow-yellow-500/5'
                  : 'border-gray-700 hover:border-gray-600 hover:bg-gray-700/30'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={formData.paymentMethod === 'bank_transfer'}
                  onChange={handleChange}
                  className="mt-1 accent-yellow-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-5 h-5 text-yellow-500" />
                    <p className="font-semibold text-white">Bank Transfer</p>
                  </div>
                  <p className="text-sm text-gray-400">Direct deposit to your bank account • ACH / Wire transfer</p>
                </div>
              </label> */}

              {/* Stripe - Commented out */}
              {/* <label className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                formData.paymentMethod === 'stripe'
                  ? 'bg-yellow-500/10 border-yellow-500/50 shadow-lg shadow-yellow-500/5'
                  : 'border-gray-700 hover:border-gray-600 hover:bg-gray-700/30'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={formData.paymentMethod === 'stripe'}
                  onChange={handleChange}
                  className="mt-1 accent-yellow-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-5 h-5 text-yellow-500" />
                    <p className="font-semibold text-white">Stripe</p>
                  </div>
                  <p className="text-sm text-gray-400">Connect your Stripe account for international payouts</p>
                </div>
              </label> */}
            </div>
          </div>

          {/* MoMo Form - Enhanced for Rwanda */}
          {formData.paymentMethod === 'momo' && (
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Phone className="w-5 h-5 text-yellow-500" />
                </div>
                <h3 className="font-semibold text-white">MTN Mobile Money Details</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  MoMo Phone Number <span className="text-yellow-500">*</span>
                </label>
                <input
                  type="tel"
                  name="momoPhoneNumber"
                  value={formData.momoPhoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="078 123 4567"
                  maxLength="12"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 font-mono text-lg"
                />
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        formData.momoPhoneNumber.replace(/\s/g, '').length === 10
                          ? 'bg-green-500 w-full'
                          : formData.momoPhoneNumber.replace(/\s/g, '').length > 0
                          ? 'bg-yellow-500'
                          : 'w-0'
                      }`}
                      style={{ 
                        width: `${Math.min(100, (formData.momoPhoneNumber.replace(/\s/g, '').length / 10) * 100)}%` 
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">
                    {formData.momoPhoneNumber.replace(/\s/g, '').length}/10 digits
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Enter your 10-digit MTN MoMo number starting with 078 or 079
                </p>
              </div>

              {/* MoMo Instructions */}
              <div className="bg-gradient-to-br from-yellow-500/5 to-yellow-600/5 border border-yellow-500/20 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-yellow-400 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  MoMo Setup Guide
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Ensure your MoMo account is active and registered with MTN Rwanda</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>You'll receive an SMS verification within 24-48 hours</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Payouts are sent automatically when users purchase your content</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>You'll receive 70% of each sale after gateway fees</span>
                  </li>
                </ul>
              </div>

              {/* Verification Timeline */}
              <div className="flex items-center gap-3 text-sm bg-gray-700/30 rounded-lg p-3">
                <Clock className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-gray-300 font-medium">Verification Timeline: 24-48 hours</p>
                  <p className="text-gray-400 text-xs">You'll be notified once your MoMo is verified</p>
                </div>
              </div>
            </div>
          )}

          {/* Bank Transfer Form - Commented out but kept for reference */}
          {/* {formData.paymentMethod === 'bank_transfer' && (
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-white mb-4">Bank Account Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Account Holder Name *
                  </label>
                  <input
                    type="text"
                    name="bankAccountHolder"
                    value={formData.bankAccountHolder}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="Bank of Kigali"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Account Number *
                  </label>
                  <input
                    type="password"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="••••••••••••••••"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Account Type
                  </label>
                  <select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
                <p className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security Note:
                </p>
                <p>Your banking details are encrypted and secure. We never store full account numbers.</p>
              </div>
            </div>
          )} */}

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/filmmaker')}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-yellow-500/50 disabled:to-yellow-600/50 text-black px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-yellow-500/20 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Payment Method'
              )}
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By saving a payment method, you agree to our terms of service and privacy policy.
            Your information is securely encrypted and stored.
          </p>
        </form>
      </div>
    </div>
  );
}

export default PaymentMethodSetup;