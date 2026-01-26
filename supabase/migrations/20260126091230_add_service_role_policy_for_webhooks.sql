/*
  # Add service role policy for webhook operations

  1. Changes
    - Add policy to allow service role (used by webhooks) to insert and update user_subscriptions
    - This is critical for Stripe webhooks to work properly

  2. Security
    - Service role bypasses RLS by default, but we add an explicit policy for clarity
    - This policy allows the webhook (authenticated as service_role) to write subscription data
    - Regular users still can only access their own data via existing policies

  3. Notes
    - Stripe webhooks use the SUPABASE_SERVICE_ROLE_KEY to write data
    - Without this policy, webhook writes might fail in some edge cases
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON user_subscriptions;

-- Allow service role to insert and update any subscription (for webhooks)
CREATE POLICY "Service role can manage all subscriptions"
  ON user_subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
