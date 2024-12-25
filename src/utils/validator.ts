export const isEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // RegEx để kiểm tra định dạng email
  return emailRegex.test(email);
};
