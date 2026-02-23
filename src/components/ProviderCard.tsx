import { useNavigate } from "react-router-dom";
import type { Provider } from "../types/provider";

function ProviderCard({ provider }: { provider: Provider }) {
  const navigate = useNavigate();

  const formatPrice = () => {
    if (!provider.priceAmount) return "Price not specified";

    const type =
      provider.priceType
        ? provider.priceType.charAt(0).toUpperCase() +
          provider.priceType.slice(1)
        : "";

    return `₹${provider.priceAmount.toLocaleString()}${
      type ? ` / ${type}` : ""
    }`;
  };

  const formatRating = () => {
    return typeof provider.averageRating === "number"
      ? provider.averageRating.toFixed(1)
      : "N/A";
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 12, marginTop: 10 }}>
      <h3>{provider.userId?.name ?? "Unknown"}</h3>

      <p>{provider.category}</p>

      <p>
        {provider.area}, {provider.city}
      </p>

      <p>{formatPrice()}</p>

      <p>⭐ {formatRating()}</p>

      <button onClick={() => navigate(`/provider/${provider._id}`)}>
        View Profile
      </button>
    </div>
  );
}

export default ProviderCard;
