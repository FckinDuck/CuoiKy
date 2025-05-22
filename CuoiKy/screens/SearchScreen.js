import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { COLORS, FONT_SIZES, SPACING } from '../utils/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const normalizeText = (text) => (text || '').toLowerCase().trim();

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSearch = async (text) => {
    setQuery(text);
    if (!text.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const snapshot = await firestore()
        .collection('FOODS')
        .orderBy('name')
        .startAt(text)
        .endAt(text + '\uf8ff')
        .get();

      const filtered = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() })) // Include ID
        .filter(food => {
          const search = normalizeText(text);
          return (
            normalizeText(food.name).includes(search) ||
            normalizeText(food.category).includes(search) ||
            normalizeText(food.description).includes(search)
          );
        });

      setResults(filtered);
    } catch (error) {
      console.error('Error searching FOODS:', error);
    }

    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => navigation.navigate('Detail', { foodId: item.id })}
    >
      <Icon name="food" size={20} color={COLORS.primary} />
      <View style={styles.resultTextWrapper}>
        <Text style={styles.resultName}>{item.name}</Text>
        <Text style={styles.resultCategory}>Phân loại: {item.category}</Text>
        <Text style={styles.resultDesc} numberOfLines={1}>{item.description}</Text>
        <Text style={styles.resultMeta}>
          Giá: {item.price?.toLocaleString() || 0}đ | Fame: {item.fame} | ⭐ {item.rating}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm món ăn hoặc mô tả..."
        placeholderTextColor={COLORS.subText}
        value={query}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: SPACING.lg }} />
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.resultsList}
        />
      ) : query ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Không có kết quả phù hợp</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    padding: SPACING.sm,
    borderRadius: 8,
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  resultsList: {
    paddingBottom: SPACING.md,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  resultTextWrapper: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  resultName: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  resultCategory: {
    fontSize: FONT_SIZES.small,
    color: COLORS.subText,
  },
  resultDesc: {
    fontSize: FONT_SIZES.small,
    color: COLORS.subText,
    fontStyle: 'italic',
  },
  resultMeta: {
    fontSize: FONT_SIZES.small,
    color: COLORS.subText,
    marginTop: 2,
  },
  empty: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  emptyText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.subText,
  },
});

export default SearchScreen;
