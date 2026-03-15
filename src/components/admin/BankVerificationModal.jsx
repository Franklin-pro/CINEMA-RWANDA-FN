import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, CreditCard, User, DollarSign, Building, Phone, Mail, Calendar } from 'lucide-react';

function BankVerificationModal({
  isOpen,
  filmmaker,
  onVerify,
  onCancel,
  isLoading = false,
  error = null,
}) {
  const [notes, setNotes] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setNotes('');
      setLocalError('');
    }
  }, [isOpen]);

  // Log the filmmaker data for debugging
  useEffect(() => {
    if (filmmaker) {
      console.log('Filmmaker data in modal:', filmmaker);
    }
  }, [filmmaker]);

  const handleVerify = () => {
    if (!filmmaker?.filmmmakerMomoPhoneNumber && !filmmaker?.filmmmakerBankDetails) {
      setLocalError('No payment method details found for verification');
      return;
    }
    onVerify(notes);
  };

  const handleCancel = () => {
    setNotes('');
    setLocalError('');
    onCancel();
  };

  if (!isOpen || !filmmaker) return null;

  // Extract payment method info from the correct structure
  const hasMomo = !!filmmaker.filmmmakerMomoPhoneNumber;
  const hasBank = Object.keys(filmmaker.filmmmakerBankDetails || {}).length > 0;
  const paymentMethod = filmmaker.filmmmakerFinancePayoutMethod || (hasMomo ? 'momo' : hasBank ? 'bank' : 'unknown');

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        {/* Modal */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-yellow-500" />
              Verify Payment Method
            </h2>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Error Display */}
            {(error || localError) && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error || localError}</p>
              </div>
            )}

            {/* Filmmaker Info */}
            <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg mb-1">{filmmaker.name}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail className="w-4 h-4 text-gray-500" />
                      {filmmaker.email}
                    </div>
                    {filmmaker.filmmmakerMomoPhoneNumber && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Phone className="w-4 h-4 text-gray-500" />
                        {filmmaker.filmmmakerMomoPhoneNumber}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                Payment Method Information
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {/* Payment Method Type */}
                <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-2">Payment Method</p>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      paymentMethod === 'momo'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : paymentMethod === 'bank'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {paymentMethod === 'momo' ? 'MTN Mobile Money' : 
                       paymentMethod === 'bank' ? 'Bank Transfer' : 
                       'Not Set'}
                    </div>
                    {filmmaker.filmmmakerIsVerified ? (
                      <span className="text-xs text-green-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-xs text-yellow-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Pending Verification
                      </span>
                    )}
                  </div>
                </div>

                {/* MoMo Details */}
                {hasMomo && (
                  <div className="bg-gradient-to-r from-yellow-500/5 to-yellow-600/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-2">Mobile Money Details</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Phone Number:</span>
                        <span className="text-white font-mono font-medium">
                          {filmmaker.filmmmakerMomoPhoneNumber}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Provider:</span>
                        <span className="text-white">MTN Rwanda</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Status:</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          filmmaker.filmmmakerIsVerified
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {filmmaker.filmmmakerIsVerified ? 'Verified' : 'Awaiting Verification'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Details */}
                {hasBank && (
                  <div className="bg-gradient-to-r from-blue-500/5 to-blue-600/5 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-2">Bank Account Details</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Bank Name:</span>
                        <span className="text-white font-medium">
                          {filmmaker.filmmmakerBankDetails.bankName || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Account Number:</span>
                        <span className="text-white font-mono">
                          {filmmaker.filmmmakerBankDetails.accountNumber 
                            ? `****${filmmaker.filmmmakerBankDetails.accountNumber.slice(-4)}`
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Account Holder:</span>
                        <span className="text-white">
                          {filmmaker.filmmmakerBankDetails.accountName || filmmaker.name}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Total Movies</p>
                    <p className="text-white font-bold text-lg">
                      {filmmaker.filmmmakerStatsTotalMovies || 0}
                    </p>
                  </div>
                  <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Total Revenue</p>
                    <p className="text-green-400 font-bold text-lg">
                      RWF {parseFloat(filmmaker.filmmmakerStatsTotalRevenue || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Application Date */}
                <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Applied On
                  </p>
                  <p className="text-white text-sm">
                    {formatDate(filmmaker.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Status Summary */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Verification Summary</h3>
              <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Filmmaker Status:</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      filmmaker.approvalStatus === 'approved'
                        ? 'bg-green-500/20 text-green-400'
                        : filmmaker.approvalStatus === 'rejected'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {filmmaker.approvalStatus || 'pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Payment Method:</span>
                    <span className="text-white text-sm capitalize">
                      {paymentMethod === 'momo' ? 'Mobile Money' : 
                       paymentMethod === 'bank' ? 'Bank Transfer' : 
                       'Not Set'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Verification Status:</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      filmmaker.filmmmakerIsVerified
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {filmmaker.filmmmakerIsVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rejection Reason (if any) */}
            {filmmaker.rejectionReason && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-xs text-red-400 mb-1">Previous Rejection Reason:</p>
                <p className="text-sm text-red-300">{filmmaker.rejectionReason}</p>
              </div>
            )}

            {/* Verification Notes */}
            <div className="space-y-3 border-t border-gray-700 pt-6">
              <h3 className="text-sm font-semibold text-white">Verification Notes (Optional)</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value.slice(0, 500))}
                disabled={isLoading}
                placeholder="Add any verification notes or comments..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 text-right">{notes.length}/500 characters</p>
            </div>

            {/* Info Alert */}
            <div className="flex gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-300">
                <p className="font-medium mb-1">Before verifying:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Confirm the phone number is active and registered with MTN Rwanda</li>
                  <li>Verify the filmmaker's identity matches their account details</li>
                  <li>Check that all information is accurate and complete</li>
                  <li>Once verified, the filmmaker will receive automatic payouts</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-700 sticky bottom-0 bg-gray-800">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleVerify}
              disabled={isLoading || (!hasMomo && !hasBank)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                hasMomo || hasBank
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {hasMomo ? 'Verify MoMo Account' : hasBank ? 'Verify Bank Account' : 'No Payment Method'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default BankVerificationModal;