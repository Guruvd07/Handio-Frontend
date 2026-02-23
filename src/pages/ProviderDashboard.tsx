'use client';

import { useEffect, useState } from "react";
import {
  getProviderBookings,
  updateBookingStatus
} from "../services/bookingService";
import "./ProviderDashboard.css";

function ProviderDashboard() {

  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token")!;
      const data = await getProviderBookings(token);
      setBookings(data);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("token")!;
      await updateBookingStatus(id, status, token);

      // ✅ Update UI instantly (no reload)
      setBookings(prev =>
        prev.map(b =>
          b._id === id ? { ...b, status } : b
        )
      );

    } catch (err) {
      console.error("Failed to update booking", err);
      alert("Failed to update booking");
    }
  };

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter(b => b.status === filter);

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    accepted: bookings.filter(b => b.status === "accepted").length,
    rejected: bookings.filter(b => b.status === "rejected").length,
  };

  return (
    <div className="provider-dashboard-page">

      <div className="dashboard-header">
        <h1>Booking Requests</h1>
        <p>Manage your service requests</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total Bookings</span>
        </div>
        <div className="stat-card pending">
          <span className="stat-number">{stats.pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card accepted">
          <span className="stat-number">{stats.accepted}</span>
          <span className="stat-label">Accepted</span>
        </div>
        <div className="stat-card rejected">
          <span className="stat-number">{stats.rejected}</span>
          <span className="stat-label">Rejected</span>
        </div>
      </div>

      <div className="filter-tabs">
        {["all", "pending", "accepted", "rejected"].map(status => (
          <button
            key={status}
            className={`filter-tab ${filter === status ? "active" : ""}`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="no-bookings">
          <p>Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="no-bookings">
          <p>
            😊 No {filter === "all" ? "bookings" : filter + " bookings"} to show
          </p>
        </div>
      ) : (
        <div className="bookings-list">
          {filteredBookings.map(b => {

            const customerName = b.customerId?.name ?? "Customer";
            const avatar = customerName.charAt(0).toUpperCase();

            return (
              <div
                key={b._id}
                className={`booking-item status-${b.status}`}
              >

                <div className="booking-header">
                  <div className="customer-info">
                    <div className="customer-avatar">
                      {avatar}
                    </div>

                    <div>
                      <h3>{customerName}</h3>
                      <p className="booking-date">
                        📅 {b.date
                          ? new Date(b.date).toLocaleDateString()
                          : "No date"}
                      </p>
                    </div>
                  </div>

                  <div className={`status-badge status-${b.status}`}>
                    {b.status.toUpperCase()}
                  </div>
                </div>

                <div className="booking-details">
                  <p className="booking-note">
                    <strong>Notes:</strong>{" "}
                    {b.note || "No additional notes"}
                  </p>
                </div>

                {b.status === "pending" && (
                  <div className="booking-actions">
                    <button
                      onClick={() => update(b._id, "accepted")}
                      className="btn-accept"
                    >
                      ✓ Accept
                    </button>

                    <button
                      onClick={() => update(b._id, "rejected")}
                      className="btn-reject"
                    >
                      ✕ Reject
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProviderDashboard;
