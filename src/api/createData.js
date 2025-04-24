import { apiClient } from "./client.js";

export async function createData(path, data = {}) {
  try {
    return await apiClient.post(path, data);
  } catch (e) {
    throw new Error(
      e.response?.data?.error || `Error creating data on ${path}: ${e.message}`,
    );
  }
}

export default createData;
