import { useEffect, useState } from "react";

type TopBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  location: string;
  onFilterChange: (filter: "location" | "company", value: string) => void;
};

export default function TopBar({
  search,
  onSearchChange,
  location,
  onFilterChange,
}: TopBarProps) {
    const [companies, setCompanies] = useState<string[]>([]);

     useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("http://localhost:3002/companies");
        const data = await res.json();
        setCompanies(data);
      } catch (err) {
        console.error("Failed to fetch companies:", err);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div className="p-4 flex flex-wrap items-center gap-2 justify-between">
      <div className="flex gap-2 flex-wrap items-center">
        <input
          type="text"
          placeholder="Search jobs..."
          className="border px-2 py-1 text-sm"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />{" "}
        <select
          className="border px-2 py-1 text-sm"
          value={location}
          onChange={(e) => onFilterChange("location", e.target.value)}
        >
          <option value="">location</option>
          <option value="telecommute">Remote</option>
        </select>

        <select
          className="border px-2 py-1 text-sm"
          onChange={(e) => onFilterChange("company", e.target.value)}
        >
          <option value="">company</option>
          {companies.map((company, i) => (
            <option key={i} value={company}>
              {company}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
