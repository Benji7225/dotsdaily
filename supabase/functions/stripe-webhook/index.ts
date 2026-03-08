import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@14.11.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Stripe-Signature",
};

const TIKTOK_PIXEL_ID = 'D6MKGRBC77U4L3UM30K0';
const TIKTOK_ACCESS_TOKEN = Deno.env.get("TIKTOK_ACCESS_TOKEN");

async function sendTikTokEvent(eventName: string, eventData: any, userId?: string, userEmail?: string) {
  if (!TIKTOK_ACCESS_TOKEN) {
    console.log('TikTok Access Token not configured, skipping event:', eventName);
    return;
  }

  try {
    const eventId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const timestamp = Math.floor(Date.now() / 1000);

    if (!userId) {
      console.warn('Warning: No userId provided for TikTok event:', eventName);
      return;
    }

    const payload = {
      pixel_code: TIKTOK_PIXEL_ID,
      event: eventName,
      event_id: eventId,
      timestamp: timestamp,
      event_source: "web",
      event_source_id: TIKTOK_PIXEL_ID,
      context: {
        user: {
          external_id: userId,
          email: userEmail,
        },
      },
      properties: eventData,
    };

    console.log('Sending TikTok event:', eventName, 'for user:', userId, 'with data:', JSON.stringify(eventData));

    const response = await fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': TIKTOK_ACCESS_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log('TikTok event response:', JSON.stringify(result));

    if (result.code !== 0) {
      console.error('TikTok API error:', result);
    }
  } catch (error) {
    console.error('Error sending TikTok event:', error);
  }
}

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

              const amount = session.amount_total ? session.amount_total / 100 : 49;

              await sendTikTokEvent('CompletePayment', {
                value: amount,
                currency: 'USD',
                content_type: 'subscription',
                content_name: 'lifetime',
                order_id: session.id,
              }, userId, customerEmail);

              await sendTikTokEvent('Subscribe', {
                value: amount,
                currency: 'USD',
                content_type: 'subscription',
                content_name: 'lifetime',
                order_id: session.id,
              }, userId, customerEmail);
            }
          } else {
            console.log("No userId found - email:", customerEmail);
          }
        } else {
          console.log("Skipping checkout - paymentStatus:", paymentStatus);
        }
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const status = subscription.status;
        const trialEnd = subscription.trial_end;

        console.log("Subscription created:", subscription.id, "Status:", status, "Trial End:", trialEnd);

        if (status === "trialing" && trialEnd) {
          const plan = subscription.items?.data[0]?.price?.recurring?.interval === 'year' ? 'annual' : 'monthly';
          const amount = plan === 'monthly' ? 2.99 : 36;

          let userEmail: string | undefined;
          let userId: string | undefined;

          if (customerId) {
            try {
              const customer = await stripe.customers.retrieve(customerId as string);
              if (customer && !customer.deleted && customer.email) {
                userEmail = customer.email;

                const { data: userData } = await supabase.auth.admin.listUsers();
                if (userData?.users) {
                  const user = userData.users.find((u: any) => u.email === userEmail);
                  if (user) {
                    userId = user.id;
                  }
                }
              }
            } catch (error) {
              console.error("Error fetching customer:", error);
            }
          }

          await sendTikTokEvent('StartTrial', {
            value: amount,
            currency: 'USD',
            content_type: 'subscription',
            content_name: plan,
          }, userId, userEmail);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const previousAttributes = event.data.previous_attributes;

        if (previousAttributes?.status === 'trialing' && subscription.status === 'active') {
          const plan = subscription.items?.data[0]?.price?.recurring?.interval === 'year' ? 'annual' : 'monthly';
          const amount = plan === 'monthly' ? 2.99 : 36;

          let userEmail: string | undefined;
          let userId: string | undefined;
          const customerId = subscription.customer;

          if (customerId) {
            try {
              const customer = await stripe.customers.retrieve(customerId as string);
              if (customer && !customer.deleted && customer.email) {
                userEmail = customer.email;

                const { data: userData } = await supabase.auth.admin.listUsers();
                if (userData?.users) {
                  const user = userData.users.find((u: any) => u.email === userEmail);
                  if (user) {
                    userId = user.id;
                  }
                }
              }
            } catch (error) {
              console.error("Error fetching customer:", error);
            }
          }

          await sendTikTokEvent('CompletePayment', {
            value: amount,
            currency: 'USD',
            content_type: 'subscription',
            content_name: plan,
            order_id: subscription.id,
          }, userId, userEmail);

          await sendTikTokEvent('Subscribe', {
            value: amount,
            currency: 'USD',
            content_type: 'subscription',
            content_name: plan,
            order_id: subscription.id,
          }, userId, userEmail);
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
