import { useEffect, useState } from "react";
export default function TopBar({ results }: any) {
  //ignore the tsx any type warning
  const [keyword, setKeyword] = useState<string>("");
  const [companies, setCompanies] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState("");

  useEffect(() => {
    fetch("http://localhost:3002/companies")
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error("Error fetching companies:", err));
  }, []);

  const handleSearch = async () => {
    const query = new URLSearchParams();
    if (keyword) query.append("keyword", keyword);
    if (selectedCompany) query.append("company", selectedCompany);

    const res = await fetch(`http://localhost:3002/searchjob?${query.toString()}`);
    const data = await res.json();
    if (results) results(data);
  };

  const handleBlankSearch = async () => {
    const res = await fetch(`http://localhost:3002/listings`);
    const data = await res.json();
    if (results) results(data);
    setKeyword("");
    setSelectedCompany("");
  };

  return (
    <div className="p-4 flex flex-wrap items-center gap-2 justify-between">
      <div className="flex gap-2 flex-wrap items-center">
        <input
          type="text"
          placeholder="Search jobs..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border px-2 py-1 text-sm"
        />
      </div>
      {/* These drop down don't do anything for the filter */}
      {/* <select className="border px-2 py-1 text-sm">
        <option>skill</option>
      </select>
      <select className="border px-2 py-1 text-sm">
        <option>urgency</option>
      </select>
      <select className="border px-2 py-1 text-sm">
        <option>pay</option>
      </select>
      <select className="border px-2 py-1 text-sm">
        <option>location</option>
      </select> */}

      <button
        onClick={handleSearch}
        className="bg-gray-700 text-white px-4 py-1 text-sm rounded"
      >
        Search
      </button>

      <button
        onClick={handleBlankSearch}
        className="bg-gray-700 text-white px-4 py-1 text-sm rounded"
      >
        Reset
      </button>

      <select
        className="border px-2 py-1 text-sm"
        value={selectedCompany}
        onChange={(e) => setSelectedCompany(e.target.value)}
      >
        <option value="">All Companies</option>
        {companies.map((c, i) => (
          <option key={i} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
