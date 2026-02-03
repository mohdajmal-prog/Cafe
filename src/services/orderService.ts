import { Order, CartItem } from "./types";
import { supabase } from "./supabase";

export const orderService = {
  // Get all orders
  async getOrders(userId?: string): Promise<Order[]> {
    try {
      let query = supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .order("created_at", { ascending: false });

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map((order) => ({
        id: order.id,
        items: (order.order_items || []).map((item: any) => ({
          id: item.item_id,
          name: item.item_name,
          price: Number(item.item_price),
          quantity: item.quantity,
          description: "",
          category: "",
          rating: 0,
          reviews: 0,
        })),
        total: Number(order.total),
        status: order.status as Order["status"],
        createdAt: new Date(order.created_at),
        estimatedTime: order.estimated_time,
      }));
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  },

  // Get single order
  async getOrder(id: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        items: (data.order_items || []).map((item: any) => ({
          id: item.item_id,
          name: item.item_name,
          price: Number(item.item_price),
          quantity: item.quantity,
          description: "",
          category: "",
          rating: 0,
          reviews: 0,
        })),
        total: Number(data.total),
        status: data.status as Order["status"],
        createdAt: new Date(data.created_at),
        estimatedTime: data.estimated_time,
      };
    } catch (error) {
      console.error("Error fetching order:", error);
      return null;
    }
  },

  // Create order
  async createOrder(items: CartItem[], userId: string = "guest"): Promise<Order> {
    try {
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const estimatedTime = Math.floor(Math.random() * 10) + 15;

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          total,
          status: "pending",
          estimated_time: estimatedTime,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        item_id: item.id,
        item_name: item.name,
        item_price: item.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return {
        id: orderData.id,
        items,
        total,
        status: "pending",
        createdAt: new Date(orderData.created_at),
        estimatedTime,
      };
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(
    orderId: string,
    status: Order["status"]
  ): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId)
        .select()
        .single();

      if (error) throw error;

      return await this.getOrder(orderId);
    } catch (error) {
      console.error("Error updating order status:", error);
      return null;
    }
  },
};
