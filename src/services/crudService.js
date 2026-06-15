import { request } from "./httpClient.js";

const unwrapList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.usuarios)) return data.usuarios;
  if (Array.isArray(data?.users)) return data.users;
  return [];
};

export const makeCrudService = (basePath) => ({
  async list() {
    return unwrapList(await request(basePath));
  },
  async create(payload) {
    return request(basePath, {
      method: "POST",
      body: payload
    });
  },
  async update(id, payload) {
    return request(`${basePath}/${id}`, {
      method: "PUT",
      body: payload
    });
  },
  async remove(id) {
    return request(`${basePath}/${id}`, {
      method: "DELETE"
    });
  }
});
