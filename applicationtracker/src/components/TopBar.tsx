type TopBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  location: string;
  onFilterChange: (
    filter: "location",
    value: string
  ) => void;
};

export default function TopBar({
  search,
  onSearchChange,
  location,
  onFilterChange,
}: TopBarProps) {
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
      </div>
    </div>
  );
}
