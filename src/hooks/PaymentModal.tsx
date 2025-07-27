import { useState } from 'react';
import { FiX, FiPhone, FiDollarSign, FiCheck } from 'react-icons/fi';
import { toast } from 'sonner';
import {paymentApi} from '../Features/api/paymentAPI';

interface PaymentModalProps {
  onClose: () => void;
  onSuccess: () => void;
  appointmentId: number;
  amount: string;
}

export const PaymentModal = ({ onClose, onSuccess, appointmentId, amount }: PaymentModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [initiateSTKPush] = paymentApi.useInitiateSTKPushMutation();

  const handleSubmit = async () => {
    if (!phoneNumber.startsWith('254')) {
      toast.error('Phone number must start with 254 (e.g., 254712345678)');
      return;
    }
    
    if (phoneNumber.length !== 12) {
      toast.error('Phone number must be 12 digits (e.g., 254712345678)');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await initiateSTKPush({
        appointmentId,
        phoneNumber,
        amount
      }).unwrap();
      
      toast.success(response.message || 'Payment request sent. Please check your phone to complete payment.');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to initiate payment');
    } finally {
      setIsProcessing(false);
    }
  };

if (!appointmentId || !amount) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Payment Error</h2>
          <p className="text-gray-700">Missing appointment information. Please try again.</p>
          <button 
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Complete Payment</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FiX className="text-xl" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Appointment ID:</span>
                <span className="font-medium">{appointmentId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-green-600">Ksh {amount}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  M-Pesa Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="254712345678"
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg"
                    maxLength={12}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Format: 254 followed by your phone number (e.g., 254712345678)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount to Pay
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={`Ksh ${amount}`}
                    readOnly
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSubmit}
                disabled={!phoneNumber || isProcessing}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 flex items-center gap-2"
              >
                {isProcessing ? 'Processing...' : (
                  <>
                    <FiCheck className="text-lg" />
                    Confirm Payment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};