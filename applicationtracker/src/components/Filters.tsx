import { useEffect, useState } from "react";

export default function Filters({
  onFilterChange,
}: {
  onFilterChange: (filters: any) => void;
}) {
  const [filters, setFilters] = useState({
    location: "",
    jobTypes: new Set<string>(),
    experienceLevels: new Set<string>(),
    favoritesOnly: false,
  });
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("http://localhost:3002/locations");
        const data = await res.json();
        setAvailableLocations(data);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      }
    };
    fetchLocations();
  }, []);

  function toggleSetValue(set: Set<string>, value: string) {
    const newSet = new Set(set);
    newSet.has(value) ? newSet.delete(value) : newSet.add(value);
    return newSet;
  }

  function handleCheckboxChange(
    type: "jobTypes" | "experienceLevels",
    value: string
  ) {
    const updated = {
      ...filters,
      [type]: toggleSetValue(filters[type], value),
    };
    setFilters(updated);
    onFilterChange(updated);
  }

  function handleLocationChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const updated = { ...filters, location: e.target.value };
    setFilters(updated);
    onFilterChange(updated);
  }

  function handleFavoritesOnlyChange(e: React.ChangeEvent<HTMLInputElement>) {
    const updated = { ...filters, favoritesOnly: e.target.checked };
    setFilters(updated);
    onFilterChange(updated);
  }

  function clearFilters() {
    const cleared = {
      location: "",
      jobTypes: new Set<string>(),
      experienceLevels: new Set<string>(),
      favoritesOnly: false,
    };
    setFilters(cleared);
    onFilterChange(cleared);
  }

  return (
    <aside className="w-full max-w-[260px] border rounded-lg p-4 bg-white shadow-md space-y-4">
      <h2 className="text-md font-semibold flex items-center gap-2">
        🔍 Filters
      </h2>

      <div>
        <label className="block text-xs font-semibold mb-1">Location</label>
        <select
          value={filters.location}
          onChange={handleLocationChange}
          className="w-full border px-3 py-2 rounded-md shadow-sm text-sm"
        >
          <option value="">All Locations</option>
          {availableLocations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1">Job Type</label>
        {[{value: "FULL TIME", label: "Full-time"},
          {value: "PART TIME", label: "Part-time"},
          {value: "INTERN", label: "Internship"},
          {value: "CONTRACT", label: "Contract"}
          // "Full-time", "Part-time", "Internship", "Contract"}
        ].map((type) => (
          <div key={type.value} className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={filters.jobTypes.has(type.value)}
              onChange={() => handleCheckboxChange("jobTypes", type.value)}
            />
            <label>{type.label}</label>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1">
          Experience Level
        </label>
        {[
          { value: "0-2", label: "0-2 years" },
          { value: "2-5", label: "2-5 years" },
          { value: "5-10", label: "5-10 years" },
          { value: "10+", label: "10+ years" }
        ].map((level) => (
          <div key={level.value} className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={filters.experienceLevels.has(level.value)}
              onChange={() => handleCheckboxChange("experienceLevels", level.value)}
            />
            <label>{level.label}</label>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1">Favorites</label>
        <label className="flex items-center space-x-2 text-sm ">
          <input
            type="checkbox"
            checked={filters.favoritesOnly}
            onChange={handleFavoritesOnlyChange}
          />
          <span>Show Favorites Only</span>
        </label>
      </div>

      <button
        className="w-full mt-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition"
        onClick={clearFilters}
      >
        Clear All Filters
      </button>
    </aside>
  );
}
