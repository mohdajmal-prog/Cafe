import { Order, MOCK_ORDERS, MOCK_MENU_ITEMS, CartItem } from "./types";
import { MOCK_DELAY } from "../constants/api";

// In-memory storage for user orders (in a real app, this would be a database)
let userOrders: Order[] = [...MOCK_ORDERS];

export const orderService = {
  // Get all orders (user orders + mock orders for demo)
  async getOrders(): Promise<Order[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...userOrders]), MOCK_DELAY);
    });
  },

  // Get single order
  async getOrder(id: string): Promise<Order | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const order = userOrders.find((o) => o.id === id);
        resolve(order || null);
      }, MOCK_DELAY / 2);
    });
  },

  // Create order
  async createOrder(items: CartItem[]): Promise<Order> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newOrder: Order = {
          id: `order_${Date.now()}`,
          items,
          total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
          status: "pending",
          createdAt: new Date(),
          estimatedTime: Math.floor(Math.random() * 10) + 5,
        };
        userOrders.push(newOrder);
        resolve(newOrder);
      }, MOCK_DELAY);
    });
  },

  // Update order status
  async updateOrderStatus(
    orderId: string,
    status: Order["status"]
  ): Promise<Order | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const order = userOrders.find((o) => o.id === orderId);
        if (order) {
          order.status = status;
        }
        resolve(order || null);
      }, MOCK_DELAY / 2);
    });
  },
};
