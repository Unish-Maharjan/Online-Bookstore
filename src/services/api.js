export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://bookstore-backend-1-nc4r.onrender.com";

export function getAuthToken() {
  return localStorage.getItem("token");
}

export async function apiRequest(path, options = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error("The server could not be reached. Please try again.");
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const error = new Error(
      data?.message || "The request could not be completed. Please try again."
    );
    error.status = response.status;
    throw error;
  }

  return data;
}
