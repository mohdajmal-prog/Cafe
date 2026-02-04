import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { CartProvider } from '../src/store/CartContext';
import { UserProvider } from '../src/store/UserContext';
import { ThemeProvider as AppThemeProvider, useTheme } from '../src/store/ThemeContext';
import { useUser } from '../src/store/UserContext';

function RootLayoutInner() {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();
  const { user } = useUser();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{ headerShown: false }}
          initialRouteName={user ? "(tabs)" : "register"}
        >
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="product-detail" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="payment" options={{ headerShown: false }} />
          <Stack.Screen name="order-success" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="edit-profile" options={{ presentation: 'modal', headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </View>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <UserProvider>
        <CartProvider>
          <RootLayoutInner />
        </CartProvider>
      </UserProvider>
    </AppThemeProvider>
  );
}
