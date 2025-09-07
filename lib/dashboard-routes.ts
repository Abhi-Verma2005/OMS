// Add this file to handle route configurations
export const DASHBOARD_ROUTES = {
  publishers: '/data',           // Your publisher listing page
  cart: '/cart',                      // Your cart page  
  orders: '/orders',        // Orders management page
  consultation: '/profile',       // Consultation booking
  analytics: '/data',   // Detailed analytics
  profile: '/profile',      // User profile
  billing: '/profile',      // Billing & payments
  support: '/profile'                 // Customer support
};

// Function to track button clicks for analytics
export const trackDashboardAction = (action: string, data?: any) => {
  if (typeof window !== 'undefined') {
    // Add your analytics tracking here
    console.log(`Dashboard Action: ${action}`, data);
    
    // Example: Google Analytics
    // gtag('event', action, {
    //   event_category: 'dashboard',
    //   event_label: data?.label,
    //   value: data?.value
    // });
  }
};
