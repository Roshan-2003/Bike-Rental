import api from "./api";

export const getBikes = async (params = {}) => {
  const response = await api.get("/bikes", {
    params,
  });

  return response.data;
};

export const getBikeById = async (id) => {
  const response = await api.get(
    `/bikes/${id}`
  );

  return response.data;
};

export const createBike = async (data) => {
  const response = await api.post(
    "/bikes",
    data
  );

  return response.data;
};

export const updateBike = async (id, data) => {
  const response = await api.put(
    `/bikes/${id}`,
    data
  );

  return response.data;
};

export const deleteBike = async (id) => {
  const response = await api.delete(
    `/bikes/${id}`
  );

  return response.data;
};