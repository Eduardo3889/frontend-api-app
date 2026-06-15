import { apiConfig } from "../config/apiConfig.js";
import { request } from "./httpClient.js";

const findToken = (data) =>
  data?.token || data?.accessToken || data?.access_token || data?.jwt || data?.data?.token;

const findUser = (data, fallbackEmail) =>
  data?.user || data?.usuario || data?.data?.user || data?.data?.usuario || { email: fallbackEmail };

export const authService = {
  async login(credentials) {
    const data = await request(apiConfig.authLoginPath, {
      method: "POST",
      body: credentials
    });
    const token = findToken(data);

    if (!token) {
      throw new Error("A resposta de login nao retornou um token JWT.");
    }

    return {
      token,
      user: findUser(data, credentials.email)
    };
  },
  async me() {
    return request(apiConfig.authMePath);
  }
};
