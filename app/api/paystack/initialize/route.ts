import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email, amount, subjects, planCount } = await req.json()

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amount * 100,
        metadata: { subjects, planCount },
        callback_url: "https://matric360learn.co.za/payment/success"
      }),
    })

    const data = await response.json()
    if (!data.status) return NextResponse.json({ error: data.message }, { status: 400 })
    return NextResponse.json(data.data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
