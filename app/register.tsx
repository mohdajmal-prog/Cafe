import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../src/constants/colors";
import { Spacing, BorderRadius } from "../src/constants/spacing";
import { Typography } from "../src/constants/fonts";
import PremiumButton from "../src/components/PremiumButton";
import { useUser } from "../src/store/UserContext";
import { User } from "../src/services/types";
import { api } from "../src/services/api";

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
      await api.verifyOTP(`+91${phoneNumber}`, otp);
      setStep("details");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteRegistration = async () => {
    if (!name.trim() || !email.trim()) {
      alert("Please fill in all details");
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: `+91${phoneNumber}`,
    };
    setUser(newUser);
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>☕</Text>
          </View>
          <Text style={[Typography.h2, { color: Colors.textPrimary, textAlign: "center" }]}>
            Afridh Cafe
          </Text>
          <Text style={[Typography.bodySmall, { color: Colors.textSecondary, textAlign: "center", marginTop: Spacing.sm }]}>
            Welcome! Let's get you started
          </Text>
        </View>

        <View style={styles.stepsContainer}>
          {[1, 2, 3].map((num) => (
            <View key={num} style={styles.stepWrapper}>
              <View style={[
                styles.stepIndicator,
                step === "details" || (step === "otp" && num <= 2) || (step === "phone" && num === 1) ? styles.stepComplete : undefined
              ]}>
                <Text style={styles.stepNumber}>{num}</Text>
              </View>
              {num < 3 && <View style={styles.stepLine} />}
            </View>
          ))}
        </View>

        {step === "phone" && (
          <View style={styles.formSection}>
            <Text style={[Typography.h4, { color: Colors.textPrimary, marginBottom: Spacing.lg }]}>
              Enter Your Phone Number
            </Text>
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
          </View>
        )}

        {step === "otp" && (
          <View style={styles.formSection}>
            <Text style={[Typography.h4, { color: Colors.textPrimary, marginBottom: Spacing.lg }]}>
              Enter OTP
            </Text>
            <Text style={[Typography.bodySmall, { color: Colors.textSecondary, marginBottom: Spacing.lg }]}>
              We've sent a 4-digit OTP to +91 {phoneNumber}
            </Text>

            <TextInput
              placeholder="0000"
              placeholderTextColor={Colors.textSecondary}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              style={styles.otpInput}
              maxLength={4}
            />

            <TouchableOpacity onPress={() => setStep("phone")} style={styles.resendContainer}>
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
          </View>
        )}

        {step === "details" && (
          <View style={styles.formSection}>
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
          </View>
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
  stepWrapper: {
    flexDirection: "row",
    alignItems: "center",
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
