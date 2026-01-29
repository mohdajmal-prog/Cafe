import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../src/constants/colors";
import { Spacing, BorderRadius, Shadows } from "../../src/constants/spacing";
import { Typography } from "../../src/constants/fonts";
import PremiumCard from "../../src/components/PremiumCard";
import PremiumButton from "../../src/components/PremiumButton";
import { useCart } from "../../src/store/CartContext";
import { orderService } from "../../src/services/orderService";

const paymentMethods = [
  { id: "card", name: "Credit/Debit Card", icon: "card" },
  { id: "upi", name: "UPI", icon: "phone-portrait" },
  { id: "wallet", name: "Digital Wallet", icon: "wallet" },
  { id: "cash", name: "Cash on Delivery", icon: "cash" },
];

export default function CartScreen() {
  const router = useRouter();
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedPayment) return;

    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create the order
    const order = await orderService.createOrder(items);

    setIsProcessing(false);
    setShowPaymentModal(false);

    // Clear cart after successful order
    clearCart();

    // Navigate to success screen with actual order ID
    router.push({
      pathname: "/order-success",
      params: { id: order.id, total: order.total.toString() },
    });
  };

  const renderCartItem = ({ item, index }: { item: any; index: number }) => (
    <PremiumCard key={item.id} style={styles.cartItem} delay={index * 50}>
      <View style={styles.itemContent}>
        <View style={styles.itemInfo}>
          <Text style={[Typography.body, { color: Colors.textPrimary }]}>
            {item.name}
          </Text>
          <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
            ₹{item.price} each
          </Text>
        </View>

        <View style={styles.itemControls}>
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
            style={styles.controlButton}
          >
            <Ionicons name="remove" size={16} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={[Typography.button, { color: Colors.textPrimary, minWidth: 30, textAlign: "center" }]}>
            {item.quantity}
          </Text>
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
            style={styles.controlButton}
          >
            <Ionicons name="add" size={16} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={[Typography.button, { color: Colors.primary, marginLeft: Spacing.md }]}>
            ₹{item.price * item.quantity}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => removeItem(item.id)}
        style={styles.removeButton}
      >
        <Ionicons name="trash-outline" size={16} color={Colors.error} />
      </TouchableOpacity>
    </PremiumCard>
  );

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <Text style={[Typography.h2, { color: Colors.textPrimary }]}>
          Your Cart
        </Text>
        {items.length > 0 && (
          <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
            {items.length} item{items.length !== 1 ? "s" : ""}
          </Text>
        )}
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {items.length > 0 ? (
          <>
            <View style={styles.itemsContainer}>
              <FlatList
                data={items}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                nestedScrollEnabled={false}
              />
            </View>

            {/* Price Summary */}
            <PremiumCard style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={[Typography.body, { color: Colors.textSecondary }]}>
                  Subtotal
                </Text>
                <Text style={[Typography.body, { color: Colors.textPrimary }]}>
                  ₹{total}
                </Text>
              </View>

              <View style={[styles.summaryRow, { marginTop: Spacing.md }]}>
                <Text style={[Typography.body, { color: Colors.textSecondary }]}>
                  Delivery Fee
                </Text>
                <Text style={[Typography.body, { color: Colors.textPrimary }]}>
                  Free
                </Text>
              </View>

              <View
                style={[
                  styles.summaryRow,
                  { marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
                ]}
              >
                <Text style={[Typography.h4, { color: Colors.textPrimary }]}>
                  Total
                </Text>
                <Text style={[Typography.h3, { color: Colors.primary }]}>
                  ₹{total}
                </Text>
              </View>
            </PremiumCard>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 64 }}>🛒</Text>
            <Text style={[Typography.h3, { color: Colors.textPrimary, marginTop: Spacing.lg }]}>
              Your cart is empty
            </Text>
            <Text style={[Typography.bodySmall, { color: Colors.textSecondary, marginTop: Spacing.md, textAlign: "center" }]}>
              Add delicious items from our menu
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      {items.length > 0 && (
        <View style={styles.footer}>
          <PremiumButton
            title="Clear Cart"
            onPress={clearCart}
            variant="secondary"
            size="sm"
          />
          <PremiumButton
            title={`Checkout • ₹${total}`}
            onPress={handleCheckout}
            size="sm"
            fullWidth
            style={{ marginLeft: Spacing.md, flex: 1 }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  itemsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  cartItem: {
    marginBottom: Spacing.md,
  },
  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
  },
  itemControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  controlButton: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButton: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
  },
  summaryCard: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.xl * 2,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
    justifyContent: "space-between",
    alignItems: "center",
  },
});
