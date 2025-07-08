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

export default function WalletCard ({ data }) {
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

  //  console.log(data);

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
        'https://swiftconnect-backend.onrender.com/payments/transfer-funds/',
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

      if (!response.ok) {
        const errorData = await response.json()
        toast.dismiss(loadingToast)
        toast.error(errorData.message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })
        setCurrentView('main')
        throw new Error(errorData.message || 'Failed to make transfer')
      }

      const data = await response.json()
      console.log('Transfer successful:', data)
      toast.update(loadingToast, {
        render: 'Transfer successful',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })
    } catch (error) {
      console.log(error.error)

      toast.update(loadingToast, {
        render: error,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      })
      console.error('Fetch error:', error)
    }
  }

  const onConfirm = pin => {
    console.log(pin)
  }

  console.log(currentView)

  const renderModalContent = () => {
    switch (currentView) {
      case 'main':
        return (
          <SendMoneyModal
            isOpen={isModalOpen}
            setView={setCurrentView}
            onClose={() => setIsModalOpen(false)}
            setIsInternal={setIsInternal}
          />
        )
      case 'swiftConnect':
        return (
          <SwiftConnectModal
            onClose={() => setIsModalOpen(false)}
            onBack={() => setCurrentView('main')}
            onNext={() => setCurrentView('confirmDetails')}
            setNarrationn={setNarration}
            setUsername={setUsername}
            setInputValue={setInputValue}
            setNarration={setNarration}
            setAmount={setAmount}
            inputValue={inputValue}
            amount={amount}
            narration={narration}
            // transferType="internal"
          />
        )
      case 'toOtherBank':
        return (
          <SendToOtherBanksModal
            onClose={() => setIsModalOpen(false)}
            onBack={() => setCurrentView('main')}
            onNext={() => setCurrentView('ToOtherBankSecondStep')}
            setName={setName}
            setAcctNum={setAcctNum}
            setchannel={setchannel}
            setBankCode={setBankCode}
            accountNum={acctNum}
            setBankName={setBankName}
            // transferType="bank"
          />
        )
      case 'ToOtherBankSecondStep':
        return (
          <SendToOtherBanksModalSecondStep
            onClose={() => setIsModalOpen(false)}
            onBack={() => setCurrentView('toOtherBank')}
            name={name}
            bank={bank_name}
            acctNum={acctNum}
            setNarrationn={setNarration}
            setUsername={setUsername}
            onNext={() => setCurrentView('confirmDetails')}
            setAmount={setAmount}
          />
        )
      case 'confirmDetails':
        return (
          <ConfirmDetials
            onClose={() => setIsModalOpen(false)}
            onBackSwift={() => setCurrentView('swiftConnect')}
            onBack={() => setCurrentView('toOtherBank')}
            narration={narration}
            username={username}
            onNext={() => setCurrentView('enterPin')}
            transferType={1}
          />
        )
      case 'enterPin':
        return (
          <>
            <ToastContainer />
            <EnterPinModal
              onClose={() => setIsModalOpen(false) || setCurrentView('main')}
              onConfirm={onConfirm}
              onNext={() => setCurrentView('success')}
              transferType={
                currentView === 'swiftConnect' ? 'internal' : 'bank'
              }
              data={currentView === 'swiftConnect' ? {} : {}}
              setPin={setPin}
              pin={pin}
              handleSubmit={makeTransfer}
            />
          </>
        )
      case 'success':
        return <SuccessModal onClose={() => setIsModalOpen(false)} />
      default:
        return null
    }
  }

  return (
    <div className='p-8 max-md\[400px\]:p-6 max-md\[400px\]:text-xl bg-[#ffffff] rounded-[1.2em] border-[0.5px] border-[#efefef] w-full max-w-full flex flex-col justify-between'>
      <ToastContainer />
      <div className='flex justify-between items-center max-md\[400px\]:flex-col max-md\[400px\]:items-start max-md\[400px\]:gap-2'>
        <div>
          <p className='text-gray-500 text-[18px] max-md\[400px\]:text-lg'>Total Balance</p>
          <p className='text-[36px] font-semibold text-gray-900 max-md\[400px\]:text-[28px]'>
            ₦{data?.balance}
          </p>
        </div>
        <div className='flex items-center gap-2 max-md\[400px\]:mt-2'>
          <Image
            src={'mastercard.svg'}
            alt='mastercard logo'
            width={100}
            height={100}
            className='w-[2.4em]'
          />
          <span className='text-gray-500 text-[18px] max-md\[400px\]:text-base'>**** 3241</span>
        </div>
      </div>
      <div className='flex gap-4 mt-4 text-[#104F01] max-md\[400px\]:flex-col max-md\[400px\]:gap-2'>
        <button
          className='flex-1 bg-[#D3F1CC] py-4 rounded-lg font-bold shadow hover:bg-green-200 max-md\[400px\]:py-3 max-md\[400px\]:text-lg'
          onClick={() => {
            setIsModalOpen(true)
          }}
        >
          Send <span className='ml-1'>↑</span>
        </button>
        <button
          className='flex-1 bg-[#D3F1CC] py-2 rounded-lg font-bold shadow hover:bg-green-200 max-md\[400px\]:py-3 max-md\[400px\]:text-lg'
          onClick={() => setIsRecieveMoneyModalOpen(true)}
        >
          Top Up <span className='ml-1'>↓</span>
        </button>
      </div>
      {isModalOpen && renderModalContent()}
      <ToastContainer />

      <ReceiveMoneyModal
        isOpen={isRecieveMoneyModalOpen}
        onClose={() => setIsRecieveMoneyModalOpen(false)}
      />
    </div>
  )
}
