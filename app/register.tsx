import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../src/constants/colors";
import { Spacing, BorderRadius, Shadows } from "../src/constants/spacing";
import { Typography } from "../src/constants/fonts";
import PremiumButton from "../src/components/PremiumButton";
import { useUser } from "../src/store/UserContext";
import { User } from "../src/services/types";

type RegistrationStep = "phone" | "otp" | "details";

export default function RegisterScreen() {
  const router = useRouter();
  const { setUser } = useUser();
  const [step, setStep] = useState<RegistrationStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isStep2Active = step === "otp" || step === "details";

  const handleSendOTP = async () => {
    if (phoneNumber.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }
    setIsLoading(true);
    // Simulate OTP sending
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep("otp");
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 4) {
      alert("Please enter a valid OTP");
      return;
    }
    setIsLoading(true);
    // Simulate OTP verification
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep("details");
  };

  const handleCompleteRegistration = async () => {
    if (!name.trim() || !email.trim()) {
      alert("Please fill in all details");
      return;
    }
    setIsLoading(true);
    // Simulate registration completion
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    // Set user in context
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: `+91${phoneNumber}`,
    };
    setUser(newUser);
    // Navigate to home
    router.replace("/(tabs)");
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
            Ambis Cafe
          </Text>
          <Text
            style={[
              Typography.bodySmall,
              { color: Colors.textSecondary, textAlign: "center", marginTop: Spacing.sm },
            ]}
          >
            Welcome! Let's get you started
          </Text>
        </Animated.View>

        {/* Step Indicators */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.stepsContainer}>
          <View style={[styles.stepIndicator, step !== "phone" && styles.stepComplete]}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <View style={styles.stepLine} />
          <View
            style={[
              styles.stepIndicator,
              step === "details" ? styles.stepComplete : step === "otp" ? styles.stepActive : undefined,
            ]}
          >
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={[styles.stepIndicator, step === "details" && styles.stepComplete]}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
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
              <Text style={[Typography.caption, { color: Colors.textSecondary, marginTop: Spacing.md }]}>
                We'll send you an OTP to verify your number
              </Text>
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

            <View style={styles.loginContainer}>
              <Text style={[Typography.body, { color: Colors.textSecondary }]}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.replace("/login")}>
                <Text style={[Typography.body, { color: Colors.primary, fontWeight: "600" }]}>
                  Login
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
              title={isLoading ? "Verifying..." : "Verify OTP"}
              onPress={handleVerifyOTP}
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading || otp.length < 4}
              style={{ marginTop: Spacing.xl }}
            />
          </Animated.View>
        )}

        {/* Details Step */}
        {step === "details" && (
          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.formSection}>
            <Text style={[Typography.h4, { color: Colors.textPrimary, marginBottom: Spacing.lg }]}>
              Complete Your Profile
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[Typography.caption, { color: Colors.textSecondary, marginBottom: Spacing.sm }]}>
                Full Name
              </Text>
              <TextInput
                placeholder="Enter your full name"
                placeholderTextColor={Colors.textSecondary}
                value={name}
                onChangeText={setName}
                style={styles.textInput}
              />
            </View>

            <View style={[styles.inputGroup, { marginTop: Spacing.lg }]}>
              <Text style={[Typography.caption, { color: Colors.textSecondary, marginBottom: Spacing.sm }]}>
                Email Address
              </Text>
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor={Colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.textInput}
              />
            </View>

            <View style={[styles.inputGroup, { marginTop: Spacing.lg }]}>
              <Text style={[Typography.caption, { color: Colors.textSecondary, marginBottom: Spacing.sm }]}>
                Phone Number
              </Text>
              <View style={[styles.textInput, { justifyContent: "center" }]}>
                <Text style={[Typography.body, { color: Colors.textPrimary }]}>
                  🇮🇳 +91 {phoneNumber}
                </Text>
              </View>
            </View>

            <PremiumButton
              title={isLoading ? "Creating Account..." : "Create Account"}
              onPress={handleCompleteRegistration}
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading || !name.trim() || !email.trim()}
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
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl * 2,
  },
  stepIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.border,
  },
  stepActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepComplete: {
    backgroundColor: Colors.primary + "20",
    borderColor: Colors.primary,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  stepLine: {
    width: 20,
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.sm,
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
  textInput: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 50,
    color: Colors.textPrimary,
    fontSize: 14,
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.xl,
  },
});
