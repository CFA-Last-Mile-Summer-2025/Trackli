import { useState } from "react";
export default function TopBar({ results }) {
  //ignore the tsx any type warning
  const [keyword, setKeyword] = useState<string>("");

  const handleSearch = async () => {
    const res = await fetch(
      `http://localhost:3002/searchjob?keyword=${encodeURIComponent(keyword)}`
    );
    const data = await res.json();
    if (results) results(data);
    console.log("filtered results:", data);
  };

  const handleBlankSearch = async () => {
    const res = await fetch(
      `http://localhost:3002/searchjob?keyword=${encodeURIComponent("")}`
    );
    const data = await res.json();
    if (results) results(data);
    console.log("filtered results:", data);
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
    </div>
  );
}
