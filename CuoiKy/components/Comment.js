import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../providers/AuthProvider';
import { COLORS, FONT_SIZES, SPACING, RADIUS } from '../utils/theme';
import { encode as btoa } from 'base-64';
import { handleLike, handleDislike } from '../utils/likeUtils';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');

const Comment = ({ comment }) => {
  const { user } = useAuth();
  const [likeStatus, setLikeStatus] = useState(null);
  const [childComments, setChildComments] = useState([]);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment?.descInfo || '');

  if (!comment) return null;

  const userId = btoa(user?.email || '');
  const isOwner = user?.email === comment.email || user?.role === 'admin';
  const isReportable = !isOwner && user?.role !== 'admin';
  const commentRef = firestore().collection('COMMENT').doc(comment.selfId);
  const foodRef = firestore().collection('FOODS').doc(comment.targetId);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
  if (!comment?.selfId || !comment?.email || !user?.email) return;

  const currentUserId = btoa(user.email);
  const currentCommentRef = firestore().collection('COMMENT').doc(comment.selfId);

  const unsubscribeLike = currentCommentRef
    .collection('likes')
    .doc(currentUserId)
    .onSnapshot(doc => {
      setLikeStatus(doc.exists ? doc.data().type : null);
    });

  const unsubscribeReplies = firestore()
    .collection('COMMENT')
    .where('targetId', '==', comment.selfId)
    .onSnapshot(snapshot => {
      const replies = snapshot.docs.map(doc => doc.data());
      setChildComments(replies);
    });

  const fetchUserInfo = async () => {
    try {
      const commentUserId = btoa(comment.email);
      const userDoc = await firestore().collection('USERS').doc(commentUserId).get();
      if (userDoc.exists) {
        setDisplayName(userDoc.data().displayName || comment.email);
      } else {
        setDisplayName(comment.email);
      }
    } catch (error) {
      console.error('Lỗi khi lấy tên hiển thị:', error);
      setDisplayName(comment.email);
    }
  };
  fetchUserInfo();

  return () => {
    unsubscribeLike();
    unsubscribeReplies();
  };
}, [comment?.email, comment?.selfId, user?.email]);

  const onLike = () => handleLike({ user, role: user.role, target: { id: comment.selfId, type: 'comment' } });
  const onDislike = () => handleDislike({ user, role: user.role, target: { id: comment.selfId, type: 'comment' } });

  const onSubmitReply = async () => {
    if (!replyText.trim()) return;
    const now = firestore.Timestamp.now();
    await firestore().collection('COMMENT').add({
      createAt: now,
      lastUpdate: now,
      descInfo: replyText,
      fame: 0,
      isHighlighted: false,
      isReported: false,
      selfId: `#${Date.now()}`,
      targetId: comment.selfId,
      email: user.email,
    });
    setReplyText('');
    setShowReplyInput(false);
  };

  const handleEdit = async () => {
    await commentRef.update({
      descInfo: editText,
      lastUpdate: firestore.Timestamp.now(),
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xoá bình luận này?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          await commentRef.delete();
          transaction.update(foodRef, {commentCount: currentCount - 1});
        },
      },
    ]);
  };

  const handleReport = () => {
    Alert.alert('Báo cáo', 'Bạn muốn báo cáo bình luận này?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Báo cáo',
        onPress: async () => {
          await commentRef.update({ isReported: true });
          
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.email}>{displayName}</Text>
        <Text style={styles.time}>{moment(comment.createAt?.toDate()).fromNow()}</Text>
      </View>

      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            value={editText}
            onChangeText={setEditText}
            style={styles.input}
            multiline
          />
          <View style={styles.editActions}>
            <TouchableOpacity onPress={() => setIsEditing(false)}>
              <Text style={styles.cancel}>Huỷ</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEdit}>
              <Text style={styles.save}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={styles.desc}>{comment.descInfo}</Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity onPress={onLike} style={styles.actionBtn}>
          <Icon
            name="thumb-up-outline"
            size={20}
            color={likeStatus === 'like' ? COLORS.primary : COLORS.subText}
          />
          <Text style={styles.actionText}>{comment.fame}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onDislike} style={styles.actionBtn}>
          <Icon
            name="thumb-down-outline"
            size={20}
            color={likeStatus === 'dislike' ? COLORS.error : COLORS.subText}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowReplyInput(prev => !prev)} style={styles.actionBtn}>
          <Icon name="comment-outline" size={20} color={COLORS.subText} />
          <Text style={styles.actionText}>{childComments.length}</Text>
        </TouchableOpacity>

        {isOwner && (
          <>
            <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.actionBtn}>
              <Icon name="pencil-outline" size={20} color={COLORS.subText} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.actionBtn}>
              <Icon name="delete-outline" size={20} color={COLORS.error} />
            </TouchableOpacity>
          </>
        )}

        {isReportable && (
          <TouchableOpacity onPress={handleReport} style={styles.actionBtn}>
            <Icon name="alert-circle-outline" size={20} color={COLORS.error} />
          </TouchableOpacity>
        )}
      </View>

      {showReplyInput && (
        <View style={styles.replyInput}>
          <TextInput
            value={replyText}
            onChangeText={setReplyText}
            placeholder="Nhập phản hồi..."
            placeholderTextColor={COLORS.subText}
            style={styles.input}
          />
          <TouchableOpacity onPress={onSubmitReply}>
            <Text style={styles.send}>Gửi</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={childComments}
        keyExtractor={(item, index) => `${item.selfId}_${index}`}
        renderItem={({ item }) => (
          <View style={styles.reply}>
            <Text style={styles.desc}>{item.descInfo}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    marginVertical: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  email: {
    fontSize: FONT_SIZES.small,
    color: COLORS.subText,
  },
  time: {
    fontSize: FONT_SIZES.small,
    color: COLORS.subText,
  },
  desc: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
    flexWrap: 'wrap',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginRight: SPACING.sm,
  },
  actionText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.subText,
  },
  replyInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.xs,
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
  },
  send: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
  },
  editContainer: {
    marginBottom: SPACING.sm,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.xs,
  },
  cancel: {
    marginRight: SPACING.md,
    color: COLORS.subText,
    fontSize: FONT_SIZES.medium,
  },
  save: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
  },
  reply: {
    marginLeft: SPACING.md,
    marginTop: SPACING.xs,
    paddingVertical: SPACING.xs,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.border,
    paddingLeft: SPACING.sm,
  },
});

export default Comment;
