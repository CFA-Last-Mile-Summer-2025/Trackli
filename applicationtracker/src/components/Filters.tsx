import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function Filters({
  onFilterChange,
}: {
  onFilterChange: (filters: any) => void;
}) {
  const [filters, setFilters] = useState({
    location: "",
    jobTypes: new Set<string>(),
    experienceLevels: new Set<string>(),
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

  function clearFilters() {
    const cleared = {
      location: "",
      jobTypes: new Set<string>(),
      experienceLevels: new Set<string>(),
    };
    setFilters(cleared);
    onFilterChange(cleared);
  }

  return (
    <aside className="w-full max-w-[260px] border rounded-lg p-4 space-y-4 backdrop-blur-lg bg-white/20 border-white/30 max-w-4xl mx-auto my-10 mt-20 shadow-2xl">
      <h2 className="text-md font-semibold flex items-center gap-2">
        🔍 Filters
      </h2>

      <div>
        <label className="block text-xs font-semibold mb-1">Location</label>
        <select
          value={filters.location}
          onChange={handleLocationChange}
          className="w-full px-3 py-2 rounded-md shadow-sm text-sm border border-white/30"
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
        {["Full-time", "Part-time", "Internship", "Contract"].map((type) => (
          <div key={type} className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={filters.jobTypes.has(type)}
              onChange={() => handleCheckboxChange("jobTypes", type)}
            />
            <label>{type}</label>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1">
          Experience Level
        </label>
        {["Entry Level", "Mid Level", "Senior Level"].map((level) => (
          <div key={level} className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={filters.experienceLevels.has(level)}
              onChange={() => handleCheckboxChange("experienceLevels", level)}
            />
            <label>{level}</label>
          </div>
        ))}
      </div>

      <Button
        className="w-full mt-2 px-4 py-2"
        onClick={clearFilters}
        variant="gradient"
      >
        Clear All Filters
      </Button>
    </aside>
  );
}
