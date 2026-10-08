/**
 * Utility functions for managing browser cookies
 */

export function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
  const secureFlag = isSecure ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secureFlag}`;
}

export function getCookie(name) {
  if (typeof document === "undefined") return null;
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const c = cookies[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }
  return null;
}

export function removeCookie(name) {
  const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
  const secureFlag = isSecure ? "; Secure" : "";
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax${secureFlag}`;
}

/**
 * Token Helpers
 * Stores token in cookies as primary storage, and syncs to localStorage for fallback.
 */

export function setAuthToken(token, days = 7) {
  if (!token) return;
  setCookie("token", token, days);
  try {
    localStorage.setItem("token", token);
  } catch {
    // localStorage might be unavailable or disabled
  }
}

export function getAuthToken() {
  // Read from cookie first
  const cookieToken = getCookie("token");
  if (cookieToken) return cookieToken;

  // Fallback to localStorage if cookie not found
  try {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      // Re-sync to cookie
      setCookie("token", localToken);
      return localToken;
    }
  } catch {
    // ignore
  }

  return null;
}

export function removeAuthToken() {
  removeCookie("token");
  try {
    localStorage.removeItem("token");
  } catch {
    // ignore
  }
}
