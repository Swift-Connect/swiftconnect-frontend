import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { accountNumber, bankCode } = await request.json();

    if (!accountNumber || !bankCode) {
      return NextResponse.json(
        { status: 'error', message: 'Please provide both account number and bank' },
        { status: 400 }
      );
    }

    // Using Paystack's API with API key
    const response = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    console.log('API Response:', data);

    if (data.status) {
      return NextResponse.json({
        status: 'success',
        data: {
          account_name: data.data.account_name,
          account_number: data.data.account_number,
          bank_id: data.data.bank_id
        }
      });
    } else {
      // Map Paystack error messages to user-friendly messages
      const errorMessages = {
        'Invalid account number': 'The account number you entered is invalid',
        'Invalid bank code': 'The selected bank is invalid',
        'No Authorization Header was found': 'Unable to verify account at this time',
        'Invalid key': 'Unable to verify account at this time',
        'Invalid bank': 'The selected bank is not supported',
        'Account number is required': 'Please enter an account number',
        'Bank code is required': 'Please select a bank'
      };

      const userMessage = errorMessages[data.message] || 'Unable to verify account. Please check the details and try again.';
      
      return NextResponse.json(
        { status: 'error', message: userMessage },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying account:', error);
    return NextResponse.json(
      { status: 'error', message: 'Unable to verify account at this time. Please try again later.' },
      { status: 500 }
    );
  }
} 