import api from "./api";

export const getWishlist = async () => {
  const response = await api.get(
    "/wishlist"
  );

  return response.data;
};

export const addToWishlist = async (
  bikeId
) => {
  const response = await api.post(
    `/wishlist/${bikeId}`
  );

  return response.data;
};

export const removeFromWishlist =
  async (bikeId) => {
    const response = await api.delete(
      `/wishlist/${bikeId}`
    );

    return response.data;
  };