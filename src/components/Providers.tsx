'use client';

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export function Providers({ children }: { children: React.ReactNode }) {
  // 强制使用你提供的正式 Live Client ID
  const paypalClientId = "Af3GXU_hJrkgF5Tt9lb8MhhyTpztjMBv8nWh2UejfJmy9OmjLnXBRmX5jhsAEYKOM_KZwONjrwGkVsWX";

  return (
    <PayPalScriptProvider 
      options={{ 
        clientId: paypalClientId,
        currency: "USD",
        intent: "capture"
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
}
