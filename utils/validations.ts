// Email Validation
// Checks if the provided email is valid and returns an object with validation result and error message
export function validateEmail(email: string): {
  isValid: boolean;
  error: string | null;
} {
  if (!email) {
    return { isValid: false, error: "Email is required." };
  }

  // Regex for standard email format
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Invalid email format." };
  }

  return { isValid: true, error: null };
}

// Password Validation
// Checks if the password meets minimum requirements and returns validation result and error message
export function validatePassword(password: string): {
  isValid: boolean;
  error: string | null;
} {
  if (!password) {
    return { isValid: false, error: "Password is required." };
  }

  // Password must be at least 6 characters
  if (password.length < 6) {
    return {
      isValid: false,
      error: "Password must be at least 6 characters long.",
    };
  }

  return { isValid: true, error: null };
}

// Checks if a value is not empty, returns error message if empty
export function notEmpty(x: any, y: string) {
  if (!x) return y + " is required";
  return "";
}
