'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import "./CustomerBookings.css";

export default function CustomerBookings() {

  const [list, setList] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await axios.get(
      "http://localhost:5000/bookings/my",
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }
    );

    setList(res.data);
  }

  const filteredList = filter === "all"
    ? list
    : list.filter(b => b.status === filter);

  const stats = {
    total: list.length,
    pending: list.filter(b => b.status === "pending").length,
    accepted: list.filter(b => b.status === "accepted").length,
    completed: list.filter(b => b.status === "completed").length,
  };

  // ✅ Correct price formatter
  const formatPrice = (provider: any) => {
    if (!provider?.priceAmount) return "Price not specified";

    const type =
      provider.priceType
        ? provider.priceType.charAt(0).toUpperCase() +
          provider.priceType.slice(1)
        : "";

    return `₹${provider.priceAmount.toLocaleString()}${
      type ? ` / ${type}` : ""
    }`;
  };

  return (
    <div className="customer-bookings-page">
      <div className="bookings-header">
        <h1>My Bookings</h1>
        <p>Track your service bookings</p>
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
          <span className="stat-label">Confirmed</span>
        </div>

        <div className="stat-card completed">
          <span className="stat-number">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      <div className="filter-tabs">
        {["all", "pending", "accepted", "completed"].map(status => (
          <button
            key={status}
            className={`filter-tab ${filter === status ? "active" : ""}`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {filteredList.length === 0 ? (
        <div className="no-bookings">
          <p>
            📭 No {filter === "all" ? "bookings" : filter + " bookings"} to show
          </p>
        </div>
      ) : (
        <div className="bookings-grid">
          {filteredList.map((b) => (
            <div key={b._id} className={`booking-card status-${b.status}`}>

              <div className="card-header">
                <div className="provider-info">
                  <div className="provider-avatar">
                    {b.providerId?.userId?.name
                      ?.charAt(0)
                      ?.toUpperCase() || "P"}
                  </div>

                  <div>
                    <h3>{b.providerId?.userId?.name || "Provider"}</h3>
                    <p className="category">{b.providerId?.category}</p>
                  </div>
                </div>

                <div className={`status-badge status-${b.status}`}>
                  {b.status === "pending" && "⏳ Pending"}
                  {b.status === "accepted" && "✓ Confirmed"}
                  {b.status === "rejected" && "✕ Rejected"}
                  {b.status === "completed" && "✓ Completed"}
                </div>
              </div>

              <div className="card-body">
                <div className="location">
                  📍 {b.providerId?.city} — {b.providerId?.area}
                </div>

                <div className="date">
                  📅 {new Date(b.date).toLocaleDateString()}
                </div>

                {b.note && (
                  <div className="note">
                    📝 {b.note}
                  </div>
                )}
              </div>

              <div className="card-footer">
                <span className="price">
                  {formatPrice(b.providerId)}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
