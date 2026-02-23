'use client';

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  SERVICE_CATEGORIES,
  INDIAN_CITIES,
  COMMON_AREAS
} from "../constants/providerOptions";
import "./CreateProviderProfile.css";

interface FormData {
  category: string;
  city: string;
  area: string;
  description: string;
  priceAmount: string;
  priceType: string;
  servicesAvailable: string[];
}

const PRICING_TYPES = [
  { value: "hour", label: "Per Hour" },
  { value: "day", label: "Per Day" },
  { value: "month", label: "Per Month" },
  { value: "visit", label: "Per Visit" },
  { value: "session", label: "Per Session" },
  { value: "fixed", label: "Fixed Price" }
];

const AVAILABLE_SERVICES = {
  "Plumber": ["Leak Repair", "Pipe Installation", "Toilet Fix", "Drainage", "Water Heater"],
  "Electrician": ["Wiring", "Lighting", "Circuit Breaker", "Power Installation", "Troubleshooting"],
  "Carpenter": ["Furniture", "Door/Window", "Shelving", "Flooring", "Repair"],
  "Painter": ["Wall Painting", "Door Painting", "Exterior", "Interior", "Texture Coating"],
  "AC Repair": ["Cleaning", "Installation", "Repair", "Maintenance", "Servicing"],
  "Cleaning": ["Home Cleaning", "Office Cleaning", "Post Renovation", "Deep Cleaning", "Regular"],
  "Home Tutor": ["Math", "Science", "English", "History", "All Subjects"],
  "Cook": ["Indian", "Continental", "Catering", "Diet Planning", "Personal Chef"],
  "Driver": ["Cab Services", "Delivery", "Long Distance", "Event", "Personal"],
  "Gardener": ["Landscaping", "Maintenance", "Planting", "Pruning", "Pest Control"],
  "Pest Control": ["Termites", "Cockroaches", "Mosquitoes", "Rodents", "General"],
  "Appliance Repair": ["Refrigerator", "Washing Machine", "Microwave", "Oven", "General"]
};

function CreateProviderProfile() {

  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    category: "",
    city: "",
    area: "",
    description: "",
    priceAmount: "",
    priceType: "",
    servicesAvailable: []
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (service: string) => {
    setForm(prev => ({
      ...prev,
      servicesAvailable: prev.servicesAvailable.includes(service)
        ? prev.servicesAvailable.filter(s => s !== service)
        : [...prev.servicesAvailable, service]
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Login required");
      return;
    }

    if (!form.category || !form.city || !form.area || !form.priceAmount || !form.priceType || !form.description) {
      alert("Please fill in all required fields");
      return;
    }

    if (form.servicesAvailable.length === 0) {
      alert("Please select at least one service");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/providers/profile",
        {
          ...form,
          priceAmount: Number(form.priceAmount)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess(true);
      setTimeout(() => {
        navigate("/provider-dashboard");
      }, 2000);
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to submit profile");
    } finally {
      setLoading(false);
    }
  };

  const categoryServices = form.category ? (AVAILABLE_SERVICES as any)[form.category] || [] : [];

  if (success) {
    return (
      <div className="create-provider-page">
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h2>Profile Submitted!</h2>
          <p>Your provider profile has been submitted for verification.</p>
          <p className="pending-text">Our admin team will review it soon and contact you.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-provider-page">
      <div className="form-container">
        <div className="form-header">
          <h1>Create Provider Profile</h1>
          <p>Set up your service provider details and get verified</p>
        </div>

        <form className="provider-form" onSubmit={submit}>
          
          {/* BASIC INFORMATION */}
          <div className="form-section">
            <h3>Basic Information</h3>

            <div className="form-group">
              <label htmlFor="category">Service Category *</label>
              <select 
                id="category"
                name="category" 
                onChange={handleChange} 
                value={form.category}
                required
                disabled={loading}
              >
                <option value="">Select your service category</option>
                {SERVICE_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  id="city"
                  name="city"
                  list="cities"
                  placeholder="e.g., Mumbai"
                  onChange={handleChange}
                  value={form.city}
                  required
                  disabled={loading}
                />

                <datalist id="cities">
                  {INDIAN_CITIES.map(c => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div className="form-group">
                <label htmlFor="area">Area/Locality *</label>
                <input
                  id="area"
                  name="area"
                  list="areas"
                  placeholder="e.g., Andheri"
                  onChange={handleChange}
                  value={form.area}
                  required
                  disabled={loading}
                />

                <datalist id="areas">
                  {COMMON_AREAS.map(a => (
                    <option key={a} value={a} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          {/* SERVICES AVAILABLE */}
          {categoryServices.length > 0 && (
            <div className="form-section">
              <h3>Services You Offer *</h3>
              <p className="section-hint">Select the services you provide</p>
              
              <div className="services-grid">
                {categoryServices.map(service => (
                  <label key={service} className="service-checkbox">
                    <input
                      type="checkbox"
                      checked={form.servicesAvailable.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      disabled={loading}
                    />
                    <span className="service-name">{service}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* PRICING */}
          <div className="form-section">
            <h3>Service Pricing</h3>

            <div className="pricing-section">
              <div className="pricing-row">
                <div className="form-group">
                  <label htmlFor="priceAmount">Amount (₹) *</label>
                  <input
                    id="priceAmount"
                    type="number"
                    name="priceAmount"
                    placeholder="Enter amount"
                    value={form.priceAmount}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="priceType">Pricing Type *</label>
                  <select
                    id="priceType"
                    name="priceType"
                    value={form.priceType}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Select pricing type</option>
                    {PRICING_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {form.priceAmount && form.priceType && (
                <div className="price-preview">
                  <span>₹{form.priceAmount} {form.priceType === "hour" ? "per hour" : form.priceType === "day" ? "per day" : form.priceType === "month" ? "per month" : form.priceType === "visit" ? "per visit" : form.priceType === "session" ? "per session" : "fixed price"}</span>
                </div>
              )}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="form-section">
            <h3>About You</h3>

            <div className="form-group">
              <label htmlFor="description">Professional Description *</label>
              <textarea
                id="description"
                name="description"
                placeholder="Tell customers about your experience, expertise, and what makes you unique..."
                value={form.description}
                onChange={handleChange}
                required
                disabled={loading}
                rows={5}
              />
              <p className="char-count">{form.description.length}/500 characters</p>
            </div>
          </div>

          <button 
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Submitting Profile..." : "Submit Profile for Verification"}
          </button>

          <p className="info-text">
            ✓ Your profile will be reviewed by our admin team within 24-48 hours
          </p>
        </form>
      </div>
    </div>
  );
}

export default CreateProviderProfile;
