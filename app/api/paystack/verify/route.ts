import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { reference } = await req.json()
    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    })
    const data = await res.json()
    if (data.data?.status === "success") return NextResponse.json({ success: true, data: data.data })
    return NextResponse.json({ success: false, data }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
