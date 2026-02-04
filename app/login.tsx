import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { Colors } from "../src/constants/colors";
import { Spacing, BorderRadius } from "../src/constants/spacing";
import { Typography } from "../src/constants/fonts";
import PremiumButton from "../src/components/PremiumButton";
import { useUser } from "../src/store/UserContext";
import { MOCK_USER } from "../src/services/types";
import { api } from "../src/services/api";

type LoginStep = "phone" | "otp";

export default function LoginScreen() {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUser();

  const handleSendOTP = async () => {
    if (phoneNumber.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }
    setIsLoading(true);
    try {
      await api.sendOTP(`+91${phoneNumber}`);
      setStep("otp");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 4) {
      alert("Please enter a valid OTP");
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.verifyOTP(`+91${phoneNumber}`, otp);
      // Assuming the response contains user data
      setUser(response.user || MOCK_USER);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(600)} style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>☕</Text>
          </View>
          <Text style={[Typography.h2, { color: Colors.textPrimary, textAlign: "center" }]}>
            Akbar Cafe
          </Text>
          <Text
            style={[
              Typography.bodySmall,
              { color: Colors.textSecondary, textAlign: "center", marginTop: Spacing.sm },
            ]}
          >
            Welcome back! Login to your account
          </Text>
        </Animated.View>

        {/* Phone Input Step */}
        {step === "phone" && (
          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.formSection}>
            <Text style={[Typography.h4, { color: Colors.textPrimary, marginBottom: Spacing.lg }]}>
              Enter Your Phone Number
            </Text>
            <View style={styles.inputGroup}>
              <View style={styles.phoneInputContainer}>
                <Text style={styles.countryCode}>🇮🇳 +91</Text>
                <TextInput
                  placeholder="Enter 10-digit number"
                  placeholderTextColor={Colors.textSecondary}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  style={styles.phoneInput}
                  maxLength={10}
                />
              </View>
            </View>

            <PremiumButton
              title={isLoading ? "Sending OTP..." : "Send OTP"}
              onPress={handleSendOTP}
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading || phoneNumber.length < 10}
              style={{ marginTop: Spacing.xl }}
            />

            <View style={styles.registerContainer}>
              <Text style={[Typography.body, { color: Colors.textSecondary }]}>
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.replace("/register")}>
                <Text style={[Typography.body, { color: Colors.primary, fontWeight: "600" }]}>
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* OTP Input Step */}
        {step === "otp" && (
          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.formSection}>
            <Text style={[Typography.h4, { color: Colors.textPrimary, marginBottom: Spacing.lg }]}>
              Enter OTP
            </Text>
            <Text style={[Typography.bodySmall, { color: Colors.textSecondary, marginBottom: Spacing.lg }]}>
              We've sent a 4-digit OTP to +91 {phoneNumber}
            </Text>

            <View style={styles.otpContainer}>
              <TextInput
                placeholder="0000"
                placeholderTextColor={Colors.textSecondary}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                style={styles.otpInput}
                maxLength={4}
              />
            </View>

            <TouchableOpacity
              onPress={() => setStep("phone")}
              style={styles.resendContainer}
            >
              <Text style={[Typography.caption, { color: Colors.primary }]}>
                Didn't receive? Change Number
              </Text>
            </TouchableOpacity>

            <PremiumButton
              title={isLoading ? "Verifying..." : "Login"}
              onPress={handleVerifyOTP}
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading || otp.length < 4}
              style={{ marginTop: Spacing.xl }}
            />
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: Spacing.xl * 2,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  logo: {
    fontSize: 48,
  },
  formSection: {
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 50,
  },
  countryCode: {
    fontSize: 14,
    marginRight: Spacing.md,
    color: Colors.textPrimary,
  },
  phoneInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "500",
  },
  otpContainer: {
    marginBottom: Spacing.lg,
  },
  otpInput: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    height: 60,
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textPrimary,
    textAlign: "center",
    letterSpacing: 8,
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.xl,
  },
});
