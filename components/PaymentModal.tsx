import React, { useState } from 'react';
import { X, CheckCircle2, QrCode, ScanLine } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  totalAmount: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, totalAmount, onClose, onSuccess }) => {
  const [isPaid, setIsPaid] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setIsScanning(true);
    // Simulate API check time
    setTimeout(() => {
      setIsScanning(false);
      setIsPaid(true);
    }, 2000);
  };

  const handleFinish = () => {
    onSuccess();
    // Reset state after closing
    setTimeout(() => {
      setIsPaid(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10">
          <X size={20} />
        </button>

        <div className="flex flex-col items-center p-8 text-center">
          {!isPaid ? (
            <>
              <div className="mb-2 text-slate-500 text-sm font-medium">Төлбөр төлөх</div>
              <div className="text-3xl font-extrabold text-slate-900 mb-8">
                {totalAmount.toLocaleString()}₮
              </div>

              {/* QR Code Container */}
              <div className="relative group w-48 h-48 bg-white p-2 rounded-2xl border-2 border-slate-100 shadow-inner mb-6">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=mongolshop_pay_${totalAmount}`} 
                  alt="QR Code" 
                  className="w-full h-full object-contain rounded-xl"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 bg-white rounded-full p-2 shadow-lg">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png" className="w-full h-full object-contain" alt="Logo" />
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-500 mb-6 px-4">
                Банкны аппликейшнаа нээгээд QR кодыг уншуулна уу (QPay, SocialPay).
              </p>

              <button
                onClick={handleSimulatePayment}
                disabled={isScanning}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isScanning ? (
                  <>Checking <ScanLine className="animate-pulse" size={18}/></>
                ) : (
                  'Төлбөр шалгах'
                )}
              </button>
            </>
          ) : (
            <div className="py-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Амжилттай!</h3>
              <p className="text-slate-500 mb-8">Таны төлбөр баталгаажлаа.</p>
              <button
                onClick={handleFinish}
                className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all"
              >
                Баярлалаа
              </button>
            </div>
          )}
        </div>
        
        {/* Footer Logos */}
        {!isPaid && (
          <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all">
             {/* Mock Bank Logos */}
             <div className="h-6 w-16 bg-slate-300 rounded"></div>
             <div className="h-6 w-16 bg-slate-300 rounded"></div>
             <div className="h-6 w-16 bg-slate-300 rounded"></div>
          </div>
        )}
      </div>
    </div>
  );
};
