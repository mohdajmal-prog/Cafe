import { View, ScrollView, StyleSheet, FlatList, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Colors } from "../../src/constants/colors";
import { Spacing, BorderRadius } from "../../src/constants/spacing";
import { Typography } from "../../src/constants/fonts";
import LuxuryHeader from "../../src/components/LuxuryHeader";
import SearchBar from "../../src/components/SearchBar";

import CategoryChip from "../../src/components/CategoryChip";
import FeaturedSection from "../../src/components/FeaturedSection";
import SkeletonLoader from "../../src/components/SkeletonLoader";
import { useMenuItems, useCategories } from "../../src/hooks/useMenu";
import { Category } from "../../src/services/types";
import { useState } from "react";

export default function HomeScreen() {
  const { items, loading } = useMenuItems();
  const { categories, loading: categoriesLoading } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    const matchesSearch = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const renderCategory = ({ item, index }: { item: Category; index: number }) => (
    <CategoryChip
      item={item}
      isSelected={selectedCategory === item.name}
      onPress={() =>
        setSelectedCategory(selectedCategory === item.name ? null : item.name)
      }
      delay={index * 50}
    />
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={styles.scrollView}
      >
        <LuxuryHeader />
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
        />


        {/* Popular Items */}
        {loading ? (
          <View style={styles.itemsSection}>
            <SkeletonLoader width="100%" height={200} borderRadius={BorderRadius.lg} />
          </View>
        ) : (
          <FeaturedSection items={filteredItems} enableNavigation={true} />
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
  scrollView: {
    flex: 1,
  },
  categoriesSection: {
    marginBottom: Spacing.lg,
  },
  categoriesContent: {
    paddingHorizontal: Spacing.lg - Spacing.md,
  },
  skeletonRow: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    flexDirection: "row",
  },
  itemsSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});
