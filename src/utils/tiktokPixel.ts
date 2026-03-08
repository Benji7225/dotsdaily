declare global {
  interface Window {
    ttq?: {
      track: (eventName: string, params?: Record<string, any>) => void;
      page: () => void;
      identify: (params?: Record<string, any>) => void;
    };
  }
}

export const trackTikTokEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.ttq) {
    try {
      window.ttq.track(eventName, params);
      console.log('TikTok Event tracked:', eventName, params);
    } catch (error) {
      console.error('TikTok tracking error:', error);
    }
  }
};

export const trackPageView = () => {
  if (typeof window !== 'undefined' && window.ttq) {
    try {
      window.ttq.page();
      console.log('TikTok Page view tracked');
    } catch (error) {
      console.error('TikTok page tracking error:', error);
    }
  }
};

export const trackCompleteRegistration = (userId?: string) => {
  trackTikTokEvent('CompleteRegistration', userId ? { user_id: userId } : undefined);
};

export const trackViewContent = (contentType: string, contentId?: string) => {
  trackTikTokEvent('ViewContent', {
    content_type: contentType,
    content_id: contentId,
  });
};

export const trackAddToCart = (contentType: string, value?: number) => {
  trackTikTokEvent('AddToCart', {
    content_type: contentType,
    value: value,
    currency: 'EUR',
  });
};

export const trackInitiateCheckout = (value?: number) => {
  trackTikTokEvent('InitiateCheckout', {
    value: value,
    currency: 'EUR',
  });
};

export const trackCompletePayment = (value: number, orderId?: string) => {
  trackTikTokEvent('CompletePayment', {
    value: value,
    currency: 'USD',
    order_id: orderId,
  });
};

export const trackStartTrial = (value: number, plan: string) => {
  trackTikTokEvent('StartTrial', {
    value: value,
    currency: 'USD',
    content_type: 'subscription',
    content_name: plan,
  });
};

export const trackSubscribe = (value: number, plan: string, orderId?: string) => {
  trackTikTokEvent('Subscribe', {
    value: value,
    currency: 'USD',
    content_type: 'subscription',
    content_name: plan,
    order_id: orderId,
  });
};

export const trackGenerateWallpaper = (mode: string) => {
  trackTikTokEvent('SubmitForm', {
    content_type: 'wallpaper_generator',
    mode: mode,
  });
};
