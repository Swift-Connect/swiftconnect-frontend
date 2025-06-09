import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { smartcardNumber, provider } = await request.json();

    if (!smartcardNumber || !provider) {
      return NextResponse.json(
        { error: "Smartcard number and provider are required" },
        { status: 400 }
      );
    }

    // Map our provider names to VTpass format
    const providerMap = {
      'dstv': 'dstv',
      'gotv': 'gotv',
      'startimes': 'startimes'
    };

    const response = await fetch("https://vtpass.com/api/merchant-verify", {
      method: "POST",
      headers: {
        "api-key": process.env.VTPASS_PUBLIC_KEY,
        "secret-key": process.env.VTPASS_SECRET_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        billersCode: smartcardNumber,
        serviceID: providerMap[provider.toLowerCase()]
      }),
    });

    const data = await response.json();
    console.log("VTpass response:", data);

    if (data.code === '000' && data.content) {
      return NextResponse.json({
        status: 'success',
        data: {
          customer_name: data.content.Customer_Name,
          status: data.content.Status,
          due_date: data.content.Due_Date,
          current_bouquet: data.content.Current_Bouquet,
          current_bouquet_price: data.content.Current_Bouquet_Price,
          current_bouquet_code: data.content.Current_Bouquet_Code,
          renewal_amount: data.content.Renewal_Amount,
          customer_type: data.content.Customer_Type,
          customer_number: data.content.Customer_Number
        }
      });
    } else {
      return NextResponse.json({
        status: 'error',
        message: data.response_description || "Failed to verify smartcard"
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify smartcard" },
      { status: 500 }
    );
  }
} 