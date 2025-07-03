import { useState, useRef } from "react";
import { Lock, X, CheckCircle, Loader2 } from "lucide-react";
import { FaLock } from "react-icons/fa";
import { changeTransactionPin } from '../../../api/index.js'
import Modal from "../../../components/common/Modal.jsx"

export default function ChangePinModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0); // 0: old pin, 1: new pin
  const [oldPin, setOldPin] = useState(["", "", "", ""]);
  const [newPin, setNewPin] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (index, value, which) => {
    if (!/^\d*$/.test(value)) return;
    const arr = which === 'old' ? [...oldPin] : [...newPin];
    arr[index] = value;
    which === 'old' ? setOldPin(arr) : setNewPin(arr);
    setSuccess('');
    setError('');
    setFieldErrors({});
    // Move focus
    if (value && index < 3) {
      inputRefs.current[step * 4 + index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e, which) => {
    if (e.key === "Backspace" && (which === 'old' ? !oldPin[index] : !newPin[index]) && index > 0) {
      inputRefs.current[step * 4 + index - 1]?.focus();
    }
  };

  const handleNext = () => {
    if (oldPin.includes("")) {
      setFieldErrors({ old: 'Enter your current PIN.' });
      return;
    }
    if (oldPin.join('').length !== 4) {
      setFieldErrors({ old_transaction_pin: ['PIN must be exactly 4 digits.'] });
      return;
    }
    setStep(1);
    setFieldErrors({});
  };

  // Go back to old PIN step and clear new PIN
  const handleBack = () => {
    setStep(0);
    setNewPin(["", "", "", ""]);
    setFieldErrors({});
    setError("");
    setSuccess("");
  };

  // Clear all state and close modal
  const handleClose = () => {
    setStep(0);
    setOldPin(["", "", "", ""]);
    setNewPin(["", "", "", ""]);
    setFieldErrors({});
    setError("");
    setSuccess("");
    onClose();
  };

  const handleChangePin = async () => {
    setLoading(true);
    setSuccess('');
    setError('');
    setFieldErrors({});
    if (newPin.includes("") || newPin.join('').length !== 4) {
      setFieldErrors({ new_transaction_pin: ['PIN must be exactly 4 digits.'] });
      setLoading(false);
      return;
    }
    // Trim and log payload
    const oldPinStr = String(oldPin.join('').trim());
    const newPinStr = String(newPin.join('').trim());
    const payload = {
      old_transaction_pin: oldPinStr,
      new_transaction_pin: newPinStr,
    };
    console.log('Submitting PIN change payload:', payload);
    try {
      await changeTransactionPin(payload);
      setSuccess('Transaction PIN changed successfully!');
      setStep(2);
      setTimeout(() => {
        handleClose();
      }, 1200);
    } catch (err) {
      console.error('PIN change error:', err, err.data);
      if (err.data) {
        setFieldErrors(err.data);
        // If error is about old pin, return to old pin step and show error
        const errMsg = typeof err.data === 'string' ? err.data : (err.data.detail || err.data.message || '');
        if (
          (errMsg && errMsg.toLowerCase().includes('old pin is incorrect')) ||
          (err.data.error && String(err.data.error).toLowerCase().includes('old pin is incorrect'))
        ) {
          setStep(0);
          setNewPin(["", "", "", ""]);
          setFieldErrors({ old_transaction_pin: [errMsg || err.data.error] });
          setError('');
        } else {
          if (typeof err.data === 'string') {
            setError(err.data);
          } else if (err.data.detail) {
            setError(err.data.detail);
          } else if (err.data.message) {
            setError(err.data.message);
          } else {
            const allErrors = Object.values(err.data).flat().join(' ');
            setError(allErrors || 'Failed to change transaction PIN.');
          }
        }
      } else {
        setError('Failed to change transaction PIN.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="bg-white w-full max-w-sm p-8 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center relative animate-fade-in">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl focus:outline-none"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon & Title */}
        <div className="flex flex-col items-center mb-4">
          {success && step === 2 ? (
            <CheckCircle className="w-14 h-14 text-green-600 animate-bounce mb-2" />
          ) : (
            <FaLock className="w-14 h-14 text-[#00613A] mb-2" />
          )}
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-1 tracking-tight">
            Change Transaction PIN
          </h2>
          <p className="text-gray-500 text-center text-base mb-2">
            {step === 0 && 'Enter your current 4-digit PIN'}
            {step === 1 && 'Enter your new 4-digit PIN'}
            {step === 2 && 'Your PIN has been changed!'}
          </p>
        </div>

        {/* PIN Input Fields */}
        {step < 2 && (
          <>
            <div className="flex justify-center gap-4 mb-2">
              {(step === 0 ? oldPin : newPin).map((digit, index) => (
                <input
                  key={index}
                  type="password"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value, step === 0 ? 'old' : 'new')}
                  onKeyDown={(e) => handleKeyDown(index, e, step === 0 ? 'old' : 'new')}
                  ref={(el) => (inputRefs.current[step * 4 + index] = el)}
                  className={`w-14 h-14 text-center text-2xl font-semibold rounded-lg bg-gray-100 border-none shadow-sm focus:bg-white focus:ring-2 transition-all duration-150 outline-none ${
                    fieldErrors[step === 0 ? 'old_transaction_pin' : 'new_transaction_pin'] ? 'ring-2 ring-red-400' : 'focus:ring-[#00613A]'
                  }`}
                  disabled={loading}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            {/* Clear button for PIN fields */}
            <button
              type="button"
              className="block mx-auto text-xs text-gray-400 hover:text-red-600 underline mb-2 mt-1"
              onClick={() => {
                if (step === 0) setOldPin(["", "", "", ""]);
                else setNewPin(["", "", "", ""]);
              }}
              disabled={loading}
            >
              Clear
            </button>
          </>
        )}
        {/* Field error */}
        {fieldErrors.old_transaction_pin && step === 0 && (
          <div className="text-red-600 text-xs mb-2 text-center">{fieldErrors.old_transaction_pin[0]}</div>
        )}
        {fieldErrors.new_transaction_pin && step === 1 && (
          <div className="text-red-600 text-xs mb-2 text-center">{fieldErrors.new_transaction_pin[0]}</div>
        )}
        {/* General error */}
        {error && <div className="text-red-600 text-xs mb-2 text-center whitespace-pre-line">{error}</div>}
        {/* Success */}
        {success && step === 2 && (
          <div className="text-green-600 text-base font-semibold mb-2 text-center animate-fade-in">{success}</div>
        )}
        {/* Buttons */}
        <div className="w-full flex flex-col gap-2 mt-4">
          {step === 0 && (
            <button
              className={`w-full py-3 rounded-full text-white font-bold shadow-md transition text-lg ${
                oldPin.includes("") || loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#00613A] hover:bg-green-700"
              } flex items-center justify-center`}
              disabled={oldPin.includes("") || loading}
              onClick={handleNext}
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
              Next
            </button>
          )}
          {step === 1 && (
            <>
              <button
                className={`w-full py-3 rounded-full text-white font-bold shadow-md transition text-lg ${
                  newPin.includes("") || loading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#00613A] hover:bg-green-700"
                } flex items-center justify-center`}
                disabled={newPin.includes("") || loading}
                onClick={handleChangePin}
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
                Change PIN
              </button>
              <button
                className="w-full py-3 rounded-full border-2 border-[#00613A] text-[#00613A] font-bold transition text-lg hover:bg-[#f6fcf5] mt-1"
                onClick={handleBack}
                disabled={loading}
              >
                Back
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
