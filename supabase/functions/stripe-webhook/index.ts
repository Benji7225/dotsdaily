import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@14.11.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Stripe-Signature",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!signature || !webhookSecret || !stripeKey) {
      throw new Error("Missing signature or webhook secret");
    }

    const body = await req.text();
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);

    console.log("Verified webhook event:", event.type, "ID:", event.id);
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const { createClient } = await import("npm:@supabase/supabase-js@2.57.4");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        let userId = session.client_reference_id;
        const customerId = session.customer;
        const paymentStatus = session.payment_status;
        const customerEmail = session.customer_details?.email || session.customer_email;

        if (paymentStatus === "paid") {
          if (!userId && customerEmail) {
            console.log("No userId in session, looking up user by email:", customerEmail);
            const { data: userData, error: userError } = await supabase.auth.admin.listUsers();

            if (!userError && userData?.users) {
              const user = userData.users.find((u: any) => u.email === customerEmail);
              if (user) {
                userId = user.id;
                console.log("Found user by email:", userId);
              } else {
                console.error("No user found with email:", customerEmail);
              }
            } else {
              console.error("Error listing users:", userError);
            }
          }

          if (userId) {
            console.log("Processing lifetime payment for user:", userId, "customerId:", customerId);

            const subscriptionData: any = {
              user_id: userId,
              stripe_subscription_id: null,
              status: "lifetime",
              plan: "lifetime",
              updated_at: new Date().toISOString(),
            };

            if (customerId) {
              subscriptionData.stripe_customer_id = customerId;
            }

            const { data, error } = await supabase
              .from("user_subscriptions")
              .upsert(subscriptionData, {
                onConflict: "user_id"
              })
              .select();

            if (error) {
              console.error("Error updating lifetime access:", error);
            } else {
              console.log("Successfully granted lifetime access:", data);
            }
          } else {
            console.log("No userId found - email:", customerEmail);
          }
        } else {
          console.log("Skipping checkout - paymentStatus:", paymentStatus);
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const customerId = paymentIntent.customer;

        if (customerId) {
          const { error } = await supabase
            .from("user_subscriptions")
            .update({
              status: "lifetime",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_customer_id", customerId);

          if (error) {
            console.error("Error updating payment status:", error);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
