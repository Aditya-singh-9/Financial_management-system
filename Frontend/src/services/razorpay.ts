
import { formatCurrency } from "@/utils/formatters";

interface RazorpayOptions {
  key: string;
  amount: number; // in smallest currency unit (paise for INR)
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler?: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    backdropclose?: boolean;
    handleback?: boolean;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface PaymentDetails {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

// This is a client-side only implementation for demo purposes
// In a production environment, order creation should happen on the server
export const RazorpayService = {
  // For demo purposes, we're using a placeholder key - in real app, use actual key
  key: 'rzp_test_yourKeyHere',
  
  // Load the Razorpay SDK dynamically
  loadSDK: (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") {
        resolve(false);
        return;
      }

      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  },
  
  // Create a new payment order
  // In a real implementation, this would make a server call to create an order
  createOrder: async (details: PaymentDetails): Promise<{ id: string; amount: number; currency: string }> => {
    // This is a mock implementation - in a real app, this would call your backend
    // which would then call Razorpay's server APIs to create an order
    console.log("Creating order with:", details);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a mock order ID
    return {
      id: `order_${Date.now()}`,
      amount: details.amount,
      currency: details.currency
    };
  },
  
  // Open Razorpay payment form
  openPaymentForm: async (options: RazorpayOptions): Promise<void> => {
    const sdkLoaded = await RazorpayService.loadSDK();
    
    if (!sdkLoaded) {
      throw new Error("Failed to load Razorpay SDK");
    }
    
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  },
  
  // Perform payment for a fee with all required details
  makePayment: async ({
    amount,
    feeTitle,
    studentName,
    email,
    phone,
    onSuccess,
    onFailure
  }: {
    amount: number;
    feeTitle: string;
    studentName: string;
    email?: string;
    phone?: string;
    onSuccess?: (response: RazorpayResponse) => void;
    onFailure?: (error: any) => void;
  }) => {
    try {
      // Load Razorpay SDK
      const sdkLoaded = await RazorpayService.loadSDK();
      if (!sdkLoaded) {
        throw new Error("Failed to load Razorpay SDK");
      }
      
      // In a real implementation, this would call your backend,
      // which would create an order with Razorpay
      const order = await RazorpayService.createOrder({
        amount: amount * 100, // Convert to paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          fee_title: feeTitle,
          student_name: studentName
        }
      });
      
      // Configure payment options
      const options: RazorpayOptions = {
        key: RazorpayService.key,
        amount: order.amount, // amount in paise
        currency: order.currency,
        name: "EduFinFlare",
        description: `Payment for ${feeTitle}`,
        image: "https://example.com/your_logo.png", // Your organization logo
        order_id: order.id,
        prefill: {
          name: studentName,
          email: email,
          contact: phone
        },
        notes: {
          address: "EduFinFlare Educational Institution"
        },
        theme: {
          color: "#9b87f5" // Your theme color
        },
        handler: function(response) {
          // Handle payment success
          console.log("Payment successful:", response);
          
          if (onSuccess) {
            onSuccess(response);
          }
        },
        modal: {
          ondismiss: function() {
            // Handle payment form dismiss
            console.log("Payment form dismissed");
            
            if (onFailure) {
              onFailure(new Error("Payment cancelled by user"));
            }
          }
        }
      };
      
      // Open Razorpay payment form
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error("Error in Razorpay payment:", error);
      
      if (onFailure) {
        onFailure(error);
      }
    }
  },
  
  // Verify payment signature (this would typically be done on the server)
  verifyPayment: async (
    paymentId: string,
    orderId: string,
    signature: string
  ): Promise<boolean> => {
    // In a real implementation, this would make a server call to verify the signature
    // using the Razorpay API
    
    console.log("Verifying payment:", { paymentId, orderId, signature });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For demo purposes, always return success
    return true;
  }
};

export default RazorpayService;
