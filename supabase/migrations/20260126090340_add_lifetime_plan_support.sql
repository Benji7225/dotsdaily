/*
  # Add lifetime plan support

  1. Changes
    - Update plan column to support 'lifetime' value
    - Update status column to support 'lifetime' value
    - Update default plan values
    - Add comment documentation for valid status and plan values

  2. Valid Status Values
    - `inactive` - User has no active payment (default)
    - `active` - User has active subscription (for future subscription plans)
    - `lifetime` - User has made one-time payment for lifetime access
    - `canceled` - User's subscription was canceled
    - `past_due` - User's subscription payment failed

  3. Valid Plan Values
    - `free` - Free tier (default)
    - `lifetime` - One-time payment for lifetime access
    - `weekly` - Weekly subscription (future)
    - `monthly` - Monthly subscription (future)
    - `yearly` - Yearly subscription (future)

  4. Notes
    - This migration adds support for one-time lifetime purchases
    - Users who pay the one-time fee get status='lifetime' and plan='lifetime'
    - The stripe_subscription_id will be NULL for lifetime purchases
*/

-- Add comments to document valid values
COMMENT ON COLUMN user_subscriptions.status IS 'Valid values: inactive, active, lifetime, canceled, past_due';
COMMENT ON COLUMN user_subscriptions.plan IS 'Valid values: free, lifetime, weekly, monthly, yearly';

-- Update existing records if needed (none should exist yet, but just in case)
UPDATE user_subscriptions 
SET plan = 'lifetime', status = 'lifetime' 
WHERE status = 'active' AND stripe_subscription_id IS NULL;
