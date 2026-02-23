import { useState } from "react";

interface Props {
  onSearch: (filters: {
    category: string;
    city: string;
    area: string;
  }) => void;
}

function SearchBar({ onSearch }: Props) {
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");

  const handleSubmit = () => {
    if (!category || !city || !area) {
      alert("Please select all filters");
      return;
    }

    onSearch({ category, city, area });
  };

  return (
    <div style={{ display: "flex", gap: 10 }}>
      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="">Category</option>
        <option value="plumber">Plumber</option>
        <option value="electrician">Electrician</option>
        <option value="chef">Chef</option>
        <option value="housekeeper">Housekeeper</option>
      </select>

      <select onChange={(e) => setCity(e.target.value)}>
        <option value="">City</option>
        <option value="Pune">Pune</option>
      </select>

      <select onChange={(e) => setArea(e.target.value)}>
        <option value="">Area</option>
        <option value="Alandi">Alandi</option>
        <option value="Wakad">Wakad</option>
        <option value="Hinjewadi">Hinjewadi</option>
      </select>

      <button onClick={handleSubmit}>Search</button>
    </div>
  );
}

export default SearchBar;
