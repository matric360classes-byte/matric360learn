import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// This makes sure Vercel doesn't cache it
export const dynamic = "force-dynamic";

// Test in browser - so you don't get 405 anymore
export async function GET() {
  return NextResponse.json({ 
    status: "webhook live - ready for Paystack POST",
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: "Missing PAYSTACK_SECRET_KEY" }, { status: 500 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: "Missing Supabase keys" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // Verify signature
    const body = await req.text();
    const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");
    const signature = req.headers.get("x-paystack-signature");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    // === 1. PAYMENT SUCCESS - UNLOCK ALL PREMIUM ===
    if (event.event === "charge.success") {
      const email = event.data.customer.email?.toLowerCase();
      const reference = event.data.reference;
      const amount = event.data.amount; // in kobo
      const customerCode = event.data.customer.customer_code;

      if (!email) {
        return NextResponse.json({ received: true });
      }

      // Unlock in subscriptions table - this unlocks ALL premium
      // Free students have no row or status=inactive
      // Premium students have status=active
      await supabase.from("subscriptions").upsert({
        email: email,
        paystack_reference: reference,
        customer_code: customerCode,
        status: "active",
        plan: "premium",
        amount: amount / 100, // convert from kobo to ZAR
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 days
        updated_at: new Date().toISOString(),
      }, { onConflict: "email" });

      // Also update profiles table for easy frontend check
      // If profile doesn't exist, create it
      const { data: existingProfile } = await supabase.from("profiles").select("email").eq("email", email).single();
      
      if (existingProfile) {
        await supabase.from("profiles").update({ is_premium: true }).eq("email", email);
      } else {
        await supabase.from("profiles").insert({ email: email, is_premium: true });
      }

      console.log(`Premium unlocked for ${email} - ${reference}`);
    }

    // === 2. PAYMENT FAILED OR SUBSCRIPTION CANCELLED - LOCK AGAIN ===
    if (
      event.event === "subscription.disable" || 
      event.event === "invoice.payment_failed" ||
      event.event === "charge.failed"
    ) {
      const email = event.data.customer?.email?.toLowerCase();
      if (email) {
        await supabase.from("subscriptions").update({ status: "inactive" }).eq("email", email);
        await supabase.from("profiles").update({ is_premium: false }).eq("email", email);
        console.log(`Premium disabled for ${email}`);
      }
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
