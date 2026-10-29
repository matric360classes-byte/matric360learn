import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use SERVICE_ROLE not anon
);

export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const body = await req.text();
  const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");

  if (hash !== req.headers.get("x-paystack-signature")) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);

  // 1. PAYMENT SUCCESS -> UNLOCK ALL PREMIUM
  if (event.event === "charge.success") {
    const email = event.data.customer.email.toLowerCase();
    const reference = event.data.reference;
    const amount = event.data.amount; // in kobo

    // Upsert into profiles/subscriptions - this unlocks everything
    await supabase.from("subscriptions").upsert({
      email,
      paystack_reference: reference,
      status: "active",
      plan: "premium", // this one flag unlocks all premium
      amount: amount / 100,
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
      updated_at: new Date().toISOString(),
    }, { onConflict: "email" });

    // Also update profiles table if you have it
    await supabase.from("profiles").update({ is_premium: true }).eq("email", email);
  }

  // 2. SUBSCRIPTION DISABLED -> LOCK AGAIN
  if (event.event === "subscription.disable" || event.event === "invoice.payment_failed") {
    const email = event.data.customer.email.toLowerCase();
    await supabase.from("subscriptions").update({ status: "inactive" }).eq("email", email);
    await supabase.from("profiles").update({ is_premium: false }).eq("email", email);
  }

  return NextResponse.json({ received: true });
}
