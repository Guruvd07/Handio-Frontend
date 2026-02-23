'use client';

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProviderById } from "../services/providerService";
import { createBooking } from "../services/bookingService";
import "./ProviderProfile.css";

function ProviderProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<any>(null);
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetchProviderById(id!).then(setProvider);
  }, [id]);

  const formatPrice = () => {
    if (!provider?.priceAmount) return "Price not specified";
    const type = provider.priceType ? provider.priceType.charAt(0).toUpperCase() + provider.priceType.slice(1) : "";
    return `₹${provider.priceAmount.toLocaleString()}${type ? ` / ${type}` : ""}`;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!date) {
      alert("Please select a date");
      return;
    }

    setLoading(true);
    try {
      await createBooking(id!, date, note, token);
      setBookingSuccess(true);
      setTimeout(() => {
        navigate("/my-bookings");
      }, 2000);
    } catch (err) {
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!provider) {
    return (
      <div className="provider-profile-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading provider details...</p>
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="provider-profile-page">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>Booking Request Sent!</h2>
          <p>The provider will review your request and contact you soon.</p>
          <p className="redirect-text">Redirecting to your bookings...</p>
        </div>
      </div>
    );
  }

  const ratingValue = provider.averageRating ? parseFloat(provider.averageRating).toFixed(1) : 'N/A';

  return (
    <div className="provider-profile-page">
      {/* HERO SECTION */}
      <div className="profile-hero">
        <div className="hero-content">
          <div className="hero-left">
            <div className="provider-avatar-hero">{provider.userId?.name?.charAt(0).toUpperCase()}</div>
          </div>
          <div className="hero-right">
            <div className="hero-header">
              <h1>{provider.userId?.name}</h1>
              <p className="service-category">{provider.category}</p>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-value">⭐ {ratingValue}</span>
                <span className="stat-label">Rating</span>
              </div>
              <div className="stat">
                <span className="stat-value">{formatPrice()}</span>
                <span className="stat-label">Pricing</span>
              </div>
              <div className="stat">
                <span className="stat-value">📍 {provider.area}</span>
                <span className="stat-label">Location</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-container">
        {/* MAIN CONTENT */}
        <div className="profile-main">
          {/* ABOUT SECTION */}
          <section className="section about-section">
            <h2>About This Service</h2>
            <p className="description">{provider.description}</p>
          </section>

          {/* SERVICES SECTION */}
          {provider.servicesAvailable && provider.servicesAvailable.length > 0 && (
            <section className="section services-section">
              <h2>Services Offered</h2>
              <div className="services-list">
                {provider.servicesAvailable.map((service: string, idx: number) => (
                  <div key={idx} className="service-item">
                    <span className="service-checkmark">✓</span>
                    <span className="service-name">{service}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* DETAILS SECTION */}
          <section className="section details-section">
            <h2>Service Details</h2>
            <div className="details-grid">
              <div className="detail-box">
                <div className="detail-icon">📍</div>
                <div className="detail-content">
                  <h4>Location</h4>
                  <p>{provider.area}, {provider.city}</p>
                </div>
              </div>
              <div className="detail-box">
                <div className="detail-icon">💰</div>
                <div className="detail-content">
                  <h4>Pricing</h4>
                  <p>{formatPrice()}</p>
                </div>
              </div>
              <div className="detail-box">
                <div className="detail-icon">✓</div>
                <div className="detail-content">
                  <h4>Verified Provider</h4>
                  <p>Trusted & Verified</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* BOOKING SIDEBAR */}
        <aside className="booking-sidebar">
          <div className="booking-card">
            <h3>Book Service</h3>
            <p className="booking-subtitle">Secure your appointment now</p>

            <form onSubmit={handleBooking} className="booking-form">
              <div className="form-group">
                <label htmlFor="booking-date">Select Date *</label>
                <input
                  id="booking-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="booking-note">Additional Notes</label>
                <textarea
                  id="booking-note"
                  placeholder="Tell the provider about your requirements..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={loading}
                  rows={4}
                />
              </div>

              <button 
                type="submit"
                className="book-btn"
                disabled={loading}
              >
                {loading ? "Sending Request..." : "Request Booking"}
              </button>
            </form>

            <div className="booking-benefits">
              <div className="benefit">
                <span className="benefit-icon">🔒</span>
                <span>Safe & Secure</span>
              </div>
              <div className="benefit">
                <span className="benefit-icon">⏱</span>
                <span>Quick Response</span>
              </div>
              <div className="benefit">
                <span className="benefit-icon">⭐</span>
                <span>Quality Assured</span>
              </div>
            </div>

            <p className="booking-note">
              The provider will contact you within 24 hours to confirm.
            </p>
          </div>

          <div className="provider-card">
            <h4>About Provider</h4>
            <div className="provider-info-box">
              <div className="info-row">
                <span className="label">Verification:</span>
                <span className="value">✓ Verified</span>
              </div>
              <div className="info-row">
                <span className="label">Response Time:</span>
                <span className="value">~ 2 hours</span>
              </div>
              <div className="info-row">
                <span className="label">Rating:</span>
                <span className="value">{ratingValue} / 5.0</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ProviderProfile;
