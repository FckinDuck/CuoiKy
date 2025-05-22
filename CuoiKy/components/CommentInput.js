import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../providers/AuthProvider';
import { COLORS, FONT_SIZES, SPACING, RADIUS } from '../utils/theme';

const CommentInput = ({ foodId }) => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
  if (!user || !user.email) {
    Alert.alert('Lỗi', 'Vui lòng đăng nhập để bình luận.');
    return;
  }

  if (!text.trim()) return;

  setLoading(true);
  try {
    const now = firestore.Timestamp.now();
    const commentRef = firestore().collection('COMMENT').doc();
    const foodRef = firestore().collection('FOOD').doc(foodId);

    await firestore().runTransaction(async (transaction) => {
      // Thêm bình luận mới
      transaction.set(commentRef, {
        createAt: now,
        lastUpdate: now,
        descInfo: text.trim(),
        fame: 0,
        isHighlighted: false,
        isReported: false,
        selfId: commentRef.id,
        targetId: foodId,
        email: user.email,
      });

      const foodDoc = await transaction.get(foodRef);
      if (!foodDoc.exists) {
        throw new Error('Món ăn không tồn tại');
      }

      const currentCount = foodDoc.data().commentCount || 0;
      transaction.update(foodRef, {
        commentCount: currentCount + 1,
      });
    });

    setText('');
  } catch (error) {
    console.error('Error submitting comment:', error);
    Alert.alert('Lỗi', 'Không thể gửi bình luận. Vui lòng thử lại.');
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
      style={styles.wrapper}
    >
      <View style={styles.container}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Viết bình luận..."
          placeholderTextColor={COLORS.subText}
          style={styles.input}
          multiline
          editable={!loading}
        />
        <TouchableOpacity onPress={onSubmit} style={styles.button} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={COLORS.onPrimary} />
          ) : (
            <Text style={styles.buttonText}>Gửi</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    marginRight: SPACING.sm,
    maxHeight: 100,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.onPrimary,
    fontWeight: 'bold',
  },
});

export default CommentInput;
