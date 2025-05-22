export const canEditFood = (user, food) => {
  return user?.role === 'admin' || user?.uid === food.authorId;
};
