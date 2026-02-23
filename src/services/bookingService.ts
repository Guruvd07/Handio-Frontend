import axios from "axios";

const API = "http://localhost:5000";

/* =========================
   CREATE BOOKING
========================= */

export const createBooking = async (
  providerId: string,
  date: string,
  note: string,
  token: string
) => {
  const res = await axios.post(
    `${API}/bookings`,
    { providerId, date, note },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

/* =========================
   PROVIDER BOOKINGS
========================= */

export const getProviderBookings = async (token: string) => {
  const res = await axios.get(`${API}/bookings/provider`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data;
};

/* =========================
   UPDATE STATUS — FIXED URL
========================= */

export const updateBookingStatus = async (
  id: string,
  status: string,
  token: string
) => {
  const res = await axios.patch(
    `${API}/bookings/${id}/status`,   // ✅ fixed
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;
};
