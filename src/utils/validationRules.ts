export const isRequiredText = (value?: string | null): boolean => {
  return typeof value === "string" && value.trim().length > 0;
};

export const hasMinLength = (
  value: string | null | undefined,
  min: number
): boolean => {
  const len = (value ?? "").trim().length;
  return len >= min;
};

export const isValidEmail = (value: string | null | undefined): boolean => {
  const v = (value ?? "").trim();
  if (!v) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(v);
};

export const onlyDigits = (value: string | null | undefined): string => {
  return (value ?? "").replace(/\D/g, "");
};

export const isTenDigitPhone = (value: string | null | undefined): boolean => {
  const digits = onlyDigits(value);
  return digits.length === 10;
};

export const isNotFutureDate = (
  isoDate: string | null | undefined
): boolean => {
  if (!isoDate) return false;
  const today = new Date().toISOString().substring(0, 10);
  return isoDate <= today;
};
