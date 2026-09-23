import api from "./api";

export const createBooking = async (data) => {
  const response = await api.post(
    "/bookings",
    data
  );

  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get(
    "/bookings/my"
  );

  return response.data;
};

export const getBookingById = async (id) => {
  const response = await api.get(
    `/bookings/${id}`
  );

  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await api.put(
    `/bookings/${id}/cancel`
  );

  return response.data;
};