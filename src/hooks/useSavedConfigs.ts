import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';

interface SavedConfig {
  id: string;
  mode: string;
  granularity: string;
  grouping: string;
  theme: string;
  theme_type: string;
  custom_color?: string;
  background_image?: string;
  dot_color?: string;
  dot_shape?: string;
  custom_text?: string;
  additional_display?: string;
  target_date?: string;
  start_date?: string;
  birth_date?: string;
  life_expectancy?: number;
  width: number;
  height: number;
  safe_top: number;
  safe_bottom: number;
  safe_left: number;
  safe_right: number;
  timezone?: string;
  created_at: string;
}

export function useSavedConfigs() {
  const { user } = useAuth();
  const [configs, setConfigs] = useState<SavedConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConfigs = async () => {
    if (!user) {
      setConfigs([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('wallpaper_configs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setConfigs(data || []);
    } catch (err) {
      console.error('Error loading configs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load configurations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, [user]);

  return { configs, loading, error, reload: loadConfigs };
}
