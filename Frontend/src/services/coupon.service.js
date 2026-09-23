import api from "./api";

export const applyCoupon = async (
  code,
  bookingAmount
) => {
  const response = await api.post(
    "/coupons/apply",
    {
      code,
      bookingAmount,
    }
  );

  return response.data;
};