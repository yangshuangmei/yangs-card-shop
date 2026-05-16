'use client';

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PayPalScriptProvider 
      options={{ 
        clientId: "AbytI2R5SHzvX1CdK_g3REr8dlh0R4euM7ZB9D8p0W8iAfzAnPCX9CEZ8jp_m9JmvjYRvNQVDomVCUU6",
        currency: "USD",
        intent: "capture"
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
}
