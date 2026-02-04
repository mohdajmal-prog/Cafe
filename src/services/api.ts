import { API_BASE_URL, ENDPOINTS } from '../constants/api';

const API_BASE_URL_LOCAL = 'https://api.example.com';

export const api = {
  getMenuItems: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  },

  getOrders: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  createOrder: async (items: any[]) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  getUserProfile: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  sendOTP: async (phoneNumber: string) => {
    try {
      // For now, use mock response since backend isn't available
      console.log('Mock OTP sent to:', phoneNumber);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      return { success: true, message: 'OTP sent successfully' };

      // Uncomment below when backend is ready:
      // const response = await fetch(`${API_BASE_URL}${ENDPOINTS.SEND_OTP}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ phoneNumber }),
      // });
      // if (!response.ok) {
      //   throw new Error('Failed to send OTP');
      // }
      // return await response.json();
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  },

  verifyOTP: async (phoneNumber: string, otp: string) => {
    try {
      // For now, use mock response since backend isn't available
      console.log('Mock OTP verification for:', phoneNumber, 'OTP:', otp);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      // Mock OTP validation - accept any 4-digit OTP for testing
      if (otp.length === 4 && /^\d{4}$/.test(otp)) {
        return {
          success: true,
          user: {
            id: `user_${Date.now()}`,
            name: 'Test User',
            email: 'test@example.com',
            phone: phoneNumber
          }
        };
      } else {
        throw new Error('Invalid OTP');
      }

      // Uncomment below when backend is ready:
      // const response = await fetch(`${API_BASE_URL}${ENDPOINTS.VERIFY_OTP}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ phoneNumber, otp }),
      // });
      // if (!response.ok) {
      //   throw new Error('Failed to verify OTP');
      // }
      // return await response.json();
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  },
};
