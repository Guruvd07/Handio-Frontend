'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./SearchProviders.css";

function SearchProviders() {

  const [filters, setFilters] = useState<any>({
    categories: [],
    cities: [],
    areas: []
  });

  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFilters();
  }, []);

  const loadFilters = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/providers/filters/options"
      );
      setFilters(res.data);
    } catch (err) {
      console.error("Failed to load filters", err);
    }
  };

  const search = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/providers",
        {
          params: { category, city, area }
        }
      );

      setResults(res.data);

    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-providers-page">
      <div className="search-container">

        <div className="search-header">
          <h1>Find Perfect Service Providers</h1>
          <p>Discover trusted professionals in your area</p>
        </div>

        <div className="filters-section">

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">Select Category</option>
            {filters.categories.map((c: any) =>
              <option key={c} value={c}>{c}</option>
            )}
          </select>

          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            className="filter-select"
          >
            <option value="">Select City</option>
            {filters.cities.map((c: any) =>
              <option key={c} value={c}>{c}</option>
            )}
          </select>

          <select
            value={area}
            onChange={e => setArea(e.target.value)}
            className="filter-select"
          >
            <option value="">Select Area</option>
            {filters.areas.map((a: any) =>
              <option key={a} value={a}>{a}</option>
            )}
          </select>

          <button
            onClick={search}
            className="search-btn"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>

        </div>
      </div>

      <div className="results-container">

        {results.length === 0 && !loading && (
          <div className="no-results">
            <p>👀 Start searching to find amazing service providers</p>
          </div>
        )}

        {loading && (
          <div className="loading">
            <p>Finding providers...</p>
          </div>
        )}

        <div className="providers-grid">

          {results.map(p => {

            const name = p.userId?.name ?? "Unknown";
            const avatar = name.charAt(0).toUpperCase();

            const formattedPrice =
              p.priceAmount
                ? `₹${p.priceAmount.toLocaleString()}${p.priceType ? ` / ${p.priceType}` : ""}`
                : "Price not set";

            const formattedRating =
              typeof p.averageRating === "number"
                ? p.averageRating.toFixed(1)
                : "N/A";

            return (
              <Link
                to={`/provider/${p._id}`}
                key={p._id}
                className="provider-card-link"
              >

                <div className="provider-card">

                  <div className="provider-header">
                    <div className="provider-avatar">{avatar}</div>

                    <div className="provider-info">
                      <h3>{name}</h3>
                      <p className="provider-category">{p.category}</p>
                    </div>
                  </div>

                  <div className="provider-location">
                    <span>📍 {p.city}, {p.area}</span>
                  </div>

                  <div className="provider-price-rating">
                  <div className="price">
                    {p.priceAmount && p.priceType
                      ? `₹${p.priceAmount} / ${p.priceType}`
                      : "Price not specified"}
                  </div>

                  <div className="rating">
                    ⭐ {p.averageRating?.toFixed(1) || "N/A"}
                  </div>
                </div>


                  <button className="view-profile-btn">
                    View Profile
                  </button>

                </div>

              </Link>
            );
          })}

        </div>

      </div>
    </div>
  );
}

export default SearchProviders;
