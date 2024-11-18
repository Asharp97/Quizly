// Email Validation
export function validateEmail(email: string): {
  isValid: boolean;
  error: string | null;
} {
  if (!email) {
    return { isValid: false, error: "Email is required." };
  }

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Invalid email format." };
  }

  return { isValid: true, error: null };
}

// Password Validation
export function validatePassword(password: string): {
  isValid: boolean;
  error: string | null;
} {
  if (!password) {
    return { isValid: false, error: "Password is required." };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: "Password must be at least 6 characters long.",
    };
  }

  return { isValid: true, error: null };
}
