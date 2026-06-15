const cleanBaseUrl = (value) => (value || "/api").replace(/\/$/, "");
const cleanPath = (value, fallback) => {
  const path = value || fallback;
  return path.startsWith("/") ? path : `/${path}`;
};

export const apiConfig = {
  baseUrl: cleanBaseUrl(import.meta.env.VITE_API_URL),
  authLoginPath: cleanPath(import.meta.env.VITE_AUTH_LOGIN_PATH, "/auth/login"),
  authMePath: cleanPath(import.meta.env.VITE_AUTH_ME_PATH, "/auth/me"),
  usersPath: cleanPath(import.meta.env.VITE_USERS_PATH, "/users"),
  itemsPath: cleanPath(import.meta.env.VITE_ITEMS_PATH, "/items")
};
