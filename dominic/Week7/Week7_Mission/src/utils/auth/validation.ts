export const isEmailValid = (value: string) =>
  value.trim().length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
export const isNicknameValid = (value: string) =>
  [...value.trim()].length >= 2 && [...value.trim()].length <= 12;
export const isPasswordValid = (value: string) =>
  new TextEncoder().encode(value).length <= 72 &&
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/.test(value);
