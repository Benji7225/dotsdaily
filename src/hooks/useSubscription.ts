import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';

export function useSubscription() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSubscription() {
      if (!user) {
        setIsPremium(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_subscriptions')
          .select('status, plan, current_period_end')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching subscription:', error);
          setIsPremium(false);
        } else if (data) {
          const hasLifetimeAccess = data.status === 'lifetime' && data.plan === 'lifetime';
          const hasActiveSubscription = data.status === 'active' &&
                                       data.current_period_end &&
                                       new Date(data.current_period_end) > new Date();
          setIsPremium(hasLifetimeAccess || hasActiveSubscription);
        } else {
          setIsPremium(false);
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    }

    checkSubscription();
  }, [user]);

  return { isPremium, loading };
}
