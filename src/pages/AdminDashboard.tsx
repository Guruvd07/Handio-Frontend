'use client';

import { useEffect, useState } from "react";
import {
  getAllProviders,
  verifyProvider
} from "../services/adminService";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token")!;
      const data = await getAllProviders(token);
      setProviders(data);
    } catch (err) {
      console.error("Failed to load providers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const verify = async (id: string) => {
    const token = localStorage.getItem("token")!;
    await verifyProvider(id, token);
    load();
  };

  const formatPrice = (p: any) => {
    if (!p.priceAmount) return "Price not set";

    const type =
      p.priceType
        ? p.priceType.charAt(0).toUpperCase() + p.priceType.slice(1)
        : "";

    return `₹${p.priceAmount.toLocaleString()}${
      type ? ` / ${type}` : ""
    }`;
  };

  const formatRating = (p: any) => {
    return typeof p.averageRating === "number"
      ? p.averageRating.toFixed(1)
      : "N/A";
  };

  return (
    <div className="admin-dashboard-page">
      <h1>Provider Verification</h1> <br />

      {loading && <p>Loading providers...</p>}

      {providers.map((p) => (
        <div key={p._id} className="provider-item">

          <div className="provider-header">
            <div>
              <h3>{p.userId?.name ?? "Unknown"}</h3>
              <p>{p.userId?.email ?? "No email"}</p>
            </div>

            <div className={p.verified ? "verified" : "pending"}>
              {p.verified ? "✓ Verified" : "Pending"}
            </div>
          </div>

          <div className="provider-details-grid">
            <div>
              <span>Service : </span>
              <strong>{p.category}</strong>
            </div>

            <div>
              <span>Location : </span>
              <strong>{p.area}, {p.city}</strong>
            </div>

            <div>
              <span>Rate : </span>
              <strong>{formatPrice(p)}</strong>
            </div>

            <div>
              <span>Rating </span>
              <strong>⭐ {formatRating(p)}</strong>
            </div>
          </div> 

          {!p.verified && (
            <button onClick={() => verify(p._id)}>
              Verify Provider
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
