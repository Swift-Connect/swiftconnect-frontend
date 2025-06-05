import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { smartCardNumber, cableName } = await request.json();

    console.log('data', smartCardNumber, cableName)
    if (!smartCardNumber || !cableName) {
      return NextResponse.json(
        { status: 'error', message: 'Please provide both smartcard number and cable provider' },
        { status: 400 }
      );
    }

    // Using vtukonnect's API with API key
    const response = await fetch(
      `https://vtukonnect.com/ajax/validate_iuc?smart_card_number=${smartCardNumber}&cablename=${cableName}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Token ${process.env.CABLE_VALIDATOR}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('response:::', response)

    const data = await response.json();
    console.log("data....", data);
    if (response.ok) {
      return NextResponse.json({
        status: 'success',
        data: data
      });
    } else {
      return NextResponse.json(
        { status: 'error', message: data.message || 'Failed to verify smartcard' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying smartcard:', error);
    return NextResponse.json(
      { status: 'error', message: 'Unable to verify smartcard at this time. Please try again later.' },
      { status: 500 }
    );
  }
} 