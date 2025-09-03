'use client'

import Image from 'next/image'
import { useState } from 'react'
import SendMoneyModal from './sendMoney/sendMoney'
import SwiftConnectModal from './sendMoney/sendtoSwiftConnect/sendMoneyTo'
import ConfirmDetials from './sendMoney/confirmDetails'
import EnterPinModal from './sendMoney/enterPin'
import SuccessModal from './sendMoney/successModal'
import SendToOtherBanksModal from './sendMoney/sendToOtherBank/SendToOtherBank'
import SendToOtherBanksModalSecondStep from './sendMoney/sendToOtherBank/sendToOtherBankSecond'
import ReceiveMoneyModal from './recieveMoney'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { handleBillsConfirm } from '@/utils/handleBillsConfirm'
import SwiftConnectReceiptModal from './sendMoney/sendtoSwiftConnect/SwiftConnectReceiptModal';
import { useUserContext } from '../../../contexts/UserContext'
import { useTransactionContext } from '../../../contexts/TransactionContext'

export default function WalletCard ({ data, refreshWallet, refreshTransactions }) {
  const [cardNumber] = useState('**** 3241')
  const [amount, setAmount] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentView, setCurrentView] = useState('main')
  const [narration, setNarration] = useState()
  const [username, setUsername] = useState()
  const [name, setName] = useState()
  const [acctNum, setAcctNum] = useState()
  const [inputValue, setInputValue] = useState('')
  const [isRecieveMoneyModalOpen, setIsRecieveMoneyModalOpen] = useState(false)
  const [pin, setPin] = useState(['', '', '', ''])
  const [isInternal, setIsInternal] = useState(false)
  const [bankcode, setBankCode] = useState('')
  const [channel, setchannel] = useState('')
  const [bank_name, setBankName] = useState('')
  const [transferError, setTransferError] = useState('')
  const [lastTransferStep, setLastTransferStep] = useState('toOtherBank')
  const [swiftConnectError, setSwiftConnectError] = useState('')
  const [swiftConnectLoading, setSwiftConnectLoading] = useState(false)
  const [modalType, setModalType] = useState('main'); // 'main', 'swiftConnect', 'toOtherBank', etc.
  const [swiftConnectReceipt, setSwiftConnectReceipt] = useState(null);
  const [showSwiftConnectReceipt, setShowSwiftConnectReceipt] = useState(false);
  const { refreshUserData, user } = useUserContext();
  const { refetch } = useTransactionContext();

  //  console.log(data);

  const clearTransferState = () => {
    setAmount('');
    setNarration('');
    setUsername('');
    setName('');
    setAcctNum('');
    setInputValue('');
    setPin(['', '', '', '']);
    setIsInternal(false);
    setBankCode('');
    setchannel('');
    setBankName('');
    setTransferError('');
    setLastTransferStep('toOtherBank');
    setSwiftConnectError('');
    setSwiftConnectLoading(false);
    setModalType('main');
    setIsModalOpen(false);
  };

  const makeTransfer = async () => {
    const loadingToast = toast.loading('Processing payment...')
    console.log('view', currentView)
    const enteredPin = pin.join('')
    onConfirm(enteredPin)
    const transferData = {
      transfer_type: isInternal ? 'internal' : 'bank',
      narration,
      amount,
      ...(isInternal
        ? { recipient_email: inputValue }
        : {
            account_number: acctNum,
            payment_type: 'paystack',
            bank_code: bankcode,
            account_bank: bank_name
          })
    }

    // Remove any fields that are empty
    Object.keys(transferData).forEach(
      key => transferData[key] === '' && delete transferData[key]
    )

    try {
      const response = await fetch(
        'https://aesthetic-mandi-swiftconnect-a9332357.koyeb.app/payments/transfer-funds/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Transaction-PIN': enteredPin,
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify(transferData)
        }
      )

      let errorMessage = 'Bank transfer failed. Please check details and try again.';
      let errorData = null;
      if (!response.ok) {
        let isServerError = response.status >= 500;
        try {
          errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonErr) {
          // If response is not JSON, keep generic error message
        }
        if (isServerError) {
          errorMessage = 'A system error occurred. Please try again later.';
          setModalType('confirmDetails');
          // setIsModalOpen(false);
        } else {
          setModalType('confirmDetails'); // Go back to confirm details for 400 errors
        }
        setTransferError(errorMessage);
        toast.dismiss(loadingToast);
        toast.error(errorMessage, { autoClose: 8000 });
        return;
      }

      const data = await response.json()
      console.log('Transfer successful:', data)
      toast.update(loadingToast, {
        render: 'Transfer successful',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })
      await refreshUserData();
      refetch && refetch();
      refreshWallet && (await refreshWallet());
      refreshTransactions && (await refreshTransactions());
      // Capture essential values before clearing state
      const localTxn = {
        amount,
        narration,
        recipient: username,
        accountNumber: acctNum,
        bankName: bank_name,
        inputValue,
        date: new Date().toLocaleString(),
      };
      setSwiftConnectReceipt({ ...data, ...localTxn });
      setShowSwiftConnectReceipt(true);
    } catch (error) {
      let errorMessage = 'Bank transfer failed. Please check details and try again.';
      if (error && error.message) {
        errorMessage = error.message;
      }
      setTransferError(errorMessage);
      setModalType('main');
      setIsModalOpen(false);
      toast.dismiss(loadingToast);
      toast.error(errorMessage, { autoClose: 8000 });
      console.error('Fetch error:', error);
    }
  }

  const onConfirm = pin => {
    console.log(pin)
  }

  console.log(currentView)

  const renderModalContent = () => {
    switch (modalType) {
      case 'main':
        return (
          <>
            {transferError && (
              <div className="w-full mb-4 bg-red-100 border border-red-400 text-red-800 px-4 py-2 rounded text-center text-xs flex items-center justify-between">
                <span>{transferError}</span>
                <button onClick={() => setTransferError('')} className="ml-2 text-red-600 font-bold">x</button>
              </div>
            )}
            <SendMoneyModal
              isOpen={isModalOpen}
              setView={view => setModalType(view)}
              onClose={() => { setIsModalOpen(false); setTransferError(''); setModalType('main'); }}
              setIsInternal={setIsInternal}
            />
          </>
        )
      case 'swiftConnect':
        return (
          <SwiftConnectModal
            onClose={() => { setIsModalOpen(false); setTransferError(''); setSwiftConnectError(''); setModalType('main'); }}
            onBack={() => { setModalType('main'); setIsInternal(false); setTransferError(''); setSwiftConnectError(''); }}
            onNext={async () => {
              setSwiftConnectError('');
              if (!inputValue) {
                setSwiftConnectError('Please enter recipient email.');
                return;
              }
              setSwiftConnectLoading(true);
              try {
                const response = await fetch(`https://aesthetic-mandi-swiftconnect-a9332357.koyeb.app/payments/get-swiftconnect-recipient/?email=${encodeURIComponent(inputValue)}`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                  }
                });
                const data = await response.json();
                if (response.ok && (data?.username || data?.email)) {
                  setUsername(data.username || data.email);
                  setModalType('confirmDetails');
                } else {
                  setSwiftConnectError(data?.message || 'Recipient not found.');
                }
              } catch (err) {
                setSwiftConnectError('Failed to fetch recipient. Please try again.');
              } finally {
                setSwiftConnectLoading(false);
              }
            }}
            setNarrationn={setNarration}
            setUsername={setUsername}
            setInputValue={setInputValue}
            setNarration={setNarration}
            setAmount={setAmount}
            inputValue={inputValue}
            amount={amount}
            narration={narration}
            error={swiftConnectError}
            isLoadingRecipient={swiftConnectLoading}
            setIsLoadingRecipient={setSwiftConnectLoading}
          />
        )
      case 'toOtherBank':
        return (
          <SendToOtherBanksModal
            onClose={() => { setIsModalOpen(false); setTransferError(''); setModalType('main'); }}
            onBack={() => { setModalType('main'); setTransferError(''); }}
            onNext={() => setModalType('ToOtherBankSecondStep')}
            setName={setName}
            setAcctNum={setAcctNum}
            setchannel={setchannel}
            setBankCode={setBankCode}
            accountNum={acctNum}
            setBankName={setBankName}
            error={transferError}
            onDismissError={() => setTransferError('')}
            // transferType="bank"
          />
        )
      case 'ToOtherBankSecondStep':
        return (
          <SendToOtherBanksModalSecondStep
            onClose={() => { setIsModalOpen(false); setTransferError(''); }}
            onBack={() => { setModalType('toOtherBank'); setTransferError(''); }}
            name={name}
            bank={bank_name}
            acctNum={acctNum}
            setNarrationn={setNarration}
            setUsername={setUsername}
            setAmount={setAmount}
            error={transferError}
            onDismissError={() => setTransferError('')}
            onNext={({ username, accountNumber, bankName }) => {
              setUsername(username);
              setAcctNum(accountNumber);
              setBankName(bankName);
              setLastTransferStep('ToOtherBankSecondStep');
              setModalType('confirmDetails');
            }}
          />
        )
      case 'confirmDetails':
        return (
          <ConfirmDetials
            // No onClose handler to prevent accidental closure of the main modal
            onBackSwift={() => { setModalType('swiftConnect'); setTransferError(''); }}
            onBack={() => { setModalType('ToOtherBankSecondStep'); setTransferError(''); }}
            narration={narration}
            username={username}
            accountNumber={acctNum}
            bankName={bank_name}
            error={transferError}
            onDismissError={() => setTransferError('')}
            onNext={() => { setLastTransferStep(modalType); setModalType('enterPin'); }}
            transferType={isInternal ? 1 : 0}
          />
        )
      case 'enterPin':
        return (
          <>
            <ToastContainer />
            <EnterPinModal
              onClose={() => { setTransferError(''); setModalType('confirmDetails'); }}
              onConfirm={onConfirm}
              handleSubmit={makeTransfer}
              transferType={modalType === 'swiftConnect' ? 'internal' : 'bank'}
              data={modalType === 'swiftConnect' ? {} : {}}
              setPin={setPin}
              pin={pin}
            />
          </>
        )
      case 'success':
        return (
          <SwiftConnectReceiptModal
            isOpen={modalType === 'success'}
            onClose={() => { setIsModalOpen(false); setModalType('main'); setSwiftConnectReceipt(null); }}
            receiptData={swiftConnectReceipt}
            recipient={username}
            narration={narration}
            amount={amount}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className='p-8 bg-[#ffffff] rounded-[1.2em] border-[0.5px] border-[#efefef] w-full flex flex-col justify-between'>
      <ToastContainer />
      <div className='flex justify-between items-center w-full'>
        <div>
          <p className='text-gray-500 text-[18px] '>Total Balance</p>
          <p className='text-[2.5em] font-semibold text-gray-900'>
            ₦{data?.balance?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </p>
        </div>
        <div className='flex items-center gap-2 max-md-[400px]:mt-2'>
          <Image
            src={'mastercard.svg'}
            alt='mastercard logo'
            width={100}
            height={100}
            className='w-[2.4em]'
          />
          <span className='text-gray-500 text-[18px] max-md-[400px]:text-base'>**** 3241</span>
        </div>
      </div>
      <div className='flex gap-4 mt-4 text-[#104F01] max-md-[400px]:flex-col max-md-[400px]:gap-2'>
        <button
          className='flex-1 bg-[#D3F1CC] py-4 rounded-lg font-bold shadow hover:bg-green-200 max-md-[400px]:py-3 max-md-[400px]:text-lg'
          onClick={() => {
            setIsModalOpen(true)
          }}
        >
          Send <span className='ml-1'>↑</span>
        </button>
        <button
          className='flex-1 bg-[#D3F1CC] py-2 rounded-lg font-bold shadow hover:bg-green-200 max-md-[400px]:py-3 max-md-[400px]:text-lg'
          onClick={() => setIsRecieveMoneyModalOpen(true)}
        >
          Top Up <span className='ml-1'>↓</span>
        </button>
      </div>
      {isModalOpen && renderModalContent()}
      <ToastContainer />

      {/* Show Swift Connect Receipt Modal */}
      {showSwiftConnectReceipt && (
        <SwiftConnectReceiptModal
          isOpen={showSwiftConnectReceipt}
          onClose={() => { setShowSwiftConnectReceipt(false); setSwiftConnectReceipt(null); clearTransferState(); }}
          receiptData={swiftConnectReceipt}
          recipient={username}
          narration={narration}
          amount={amount}
        />
      )}

      <ReceiveMoneyModal
        isOpen={isRecieveMoneyModalOpen}
        onClose={() => setIsRecieveMoneyModalOpen(false)}
      />
    </div>
  )
}
