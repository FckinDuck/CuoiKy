import React, { useState, useEffect } from 'react';
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
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [tags, setTags] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const snapshot = await firestore().collection('TAGS').get();
        const tagList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTags(tagList);
      } catch (error) {
        console.error('Lỗi khi lấy TAGS:', error);
      }
    };

    fetchTags();
  }, []);

  const handleSearch = async (text) => {
    setQuery(text);
    if (!text.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const snapshot = await firestore().collection('FOODS').get();
      const search = normalizeText(text);

      let filtered = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(food => {
          const name = normalizeText(food.name);
          const desc = normalizeText(food.description);
          const category = normalizeText(food.category);

          const matchesSearch =
            name.includes(search) ||
            desc.includes(search) ||
            category.includes(search);

          const matchesCategory =
            selectedCategory === 'all' ||
            normalizeText(food.category) === normalizeText(selectedCategory);

          return matchesSearch && matchesCategory;
        });

      filtered.sort((a, b) => {
        const aVal = a[sortKey] ?? 0;
        const bVal = b[sortKey] ?? 0;
        if (sortOrder === 'asc') return aVal > bVal ? 1 : -1;
        else return aVal < bVal ? 1 : -1;
      });

      setResults(filtered);
    } catch (error) {
      console.error('Lỗi tìm kiếm FOODS:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (query.trim()) {
      handleSearch(query);
    }
  }, [selectedCategory, sortKey, sortOrder]);

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
      
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Lọc:</Text>
        <FlatList
          horizontal
          data={tags}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.tagButton}>
              <Text style={styles.tagText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.sortRow}>
        <Text style={styles.filterLabel}>Sắp xếp theo:</Text>
        {['price', 'fame', 'rating'].map(key => (
          <TouchableOpacity key={key} onPress={() => setSortKey(key)}>
            <Text style={sortKey === key ? styles.activeFilter : styles.filterText}>{key}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
          <Icon
            name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
            size={18}
            color={COLORS.primary}
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>

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
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: SPACING.sm,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  filterLabel: {
    fontSize: FONT_SIZES.medium,
    marginRight: SPACING.xs,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  filterText: {
    marginRight: SPACING.md,
    fontSize: FONT_SIZES.small,
    color: COLORS.subText,
  },
  activeFilter: {
    marginRight: SPACING.md,
    fontSize: FONT_SIZES.small,
    color: COLORS.primary,
    fontWeight: 'bold',
  },

  tagButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  tagText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.primary,
    fontWeight: '500',
  },
});

export default SearchScreen;
