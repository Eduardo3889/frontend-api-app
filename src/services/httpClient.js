import { apiConfig } from "../config/apiConfig.js";
import { tokenStorage } from "./tokenStorage.js";

const buildUrl = (path) => `${apiConfig.baseUrl}${path}`;

const normalizeError = async (response) => {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  const message =
    data?.message ||
    data?.error ||
    data?.detail ||
    data?.errors?.[0]?.message ||
    "Nao foi possivel concluir a operacao.";

  const error = new Error(Array.isArray(message) ? message.join(", ") : message);
  error.status = response.status;
  error.data = data;
  return error;
};

export async function request(path, options = {}) {
  const token = tokenStorage.getToken();
  const headers = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    const error = await normalizeError(response);
    if (response.status === 401) {
      tokenStorage.clear();
      window.dispatchEvent(new CustomEvent("auth:expired"));
    }
    throw error;
  }

  const contentType = response.headers.get("content-type") || "";
  return contentType.includes("application/json") ? response.json() : response.text();
}
