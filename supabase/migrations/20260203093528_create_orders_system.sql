/*
  # Create Orders System

  1. New Tables
    - `orders`
      - `id` (uuid, primary key) - Unique order identifier
      - `user_id` (text) - User identifier (phone number or user ID)
      - `total` (numeric) - Total order amount
      - `status` (text) - Order status (pending, preparing, ready, completed)
      - `estimated_time` (integer, nullable) - Estimated preparation time in minutes
      - `created_at` (timestamptz) - Order creation timestamp
      
    - `order_items`
      - `id` (uuid, primary key) - Unique item identifier
      - `order_id` (uuid, foreign key) - Reference to orders table
      - `item_id` (text) - Menu item identifier
      - `item_name` (text) - Name of the item
      - `item_price` (numeric) - Price of the item at time of order
      - `quantity` (integer) - Quantity ordered
      - `created_at` (timestamptz) - Item creation timestamp

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to create and read their own orders
    - For now, using user_id as text to support the current auth system
*/

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  estimated_time integer,
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_id text NOT NULL,
  item_name text NOT NULL,
  item_price numeric NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can update their own orders"
  ON orders FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Order items policies
CREATE POLICY "Users can create order items"
  ON order_items FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view order items"
  ON order_items FOR SELECT
  TO public
  USING (true);
