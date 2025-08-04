import Navbar from "@/components/Navbar";
import JobCard from "../components/NewJobCard";
import TopBar from "../components/TopBar";
import AddJobForm from "@/components/AddJobForm";
import { useEffect, useState } from "react";
import Filters from "@/components/Filters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchWithAuth } from "@/utils/tokenChecker";

interface Job {
  title: string;
  company: string;
  skills?: string;
  location: string;
  jobType?: string;
  url: string;
  _id?: string;
  date_expiration?: string;
}

type SortOrder = "newest" | "oldest" | "none";

function App() {
  const [offset, setOffset] = useState<number>(() => {
    const savedOffset = localStorage.getItem("offset");
    return savedOffset ? parseInt(savedOffset) : 15;
  });

  const handleLoadMoreJobs = async () => {
    try {
      const res = await fetch(`http://localhost:3002/getjobs?offset=${offset}`);
      const data = await res.json();
      fetchJobs();
      // Update offset in state and localStorage
      const newOffset = offset + 10;
      setOffset(newOffset);
      localStorage.setItem("offset", newOffset.toString());
    } catch (err) {
      console.error("Error loading more jobs:", err);
    }
  };

  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");
  const [filters, setFilters] = useState({
    location: "",
    jobTypes: new Set<string>(),
  });

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:3002/listings"); // gh pages will prob need this to be changed if we want hosting
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  const [favorites, setFavorites] = useState<Job[]>([]);

  const fetchFavorites = async () => {
    try {
      const res = await fetchWithAuth("http://localhost:3002/favorite", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      const arrayData = Array.isArray(data) ? data : [];
      setFavorites(arrayData);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
      setFavorites([]);
    }
  };

  const handleFavoriteToggle = async (job: Job) => {
    const matched = favorites.find(
      (f) =>
        f.title === job.title && f.company === job.company && f.url === job.url
    );
    try {
      if (matched) {
        await fetchWithAuth(`http://localhost:3002/favorite/${matched._id}`, {
          method: "DELETE",
        });
      } else {
        await fetchWithAuth("http://localhost:3002/addFavorite", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(job),
        });
      }

      await fetchFavorites();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDateSort = () => {
    if (sortOrder === "none") {
      setSortOrder("newest");
    } else if (sortOrder === "newest") {
      setSortOrder("oldest");
    } else {
      setSortOrder("none");
    }
  };

  const getSortButtonText = () => {
    switch (sortOrder) {
      case "newest":
        return "Sort: Newest First";
      case "oldest":
        return "Sort: Oldest First";
      default:
        return "Sort by Date";
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchFavorites();
  }, []);

  const filteredAndSortedJobs = (() => {
    const filtered = jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase());

      const matchesLocation =
        !filters.location || job.location === filters.location;

      const matchesJobType =
        filters.jobTypes.size === 0 || filters.jobTypes.has(job.jobType || "");

      return matchesSearch && matchesLocation && matchesJobType;
    });

    if (sortOrder === "none") {
      return filtered;
    }

    return filtered.sort((a, b) => {
      const dateA = a.date_expiration
        ? new Date(a.date_expiration)
        : new Date(0);
      const dateB = b.date_expiration
        ? new Date(b.date_expiration)
        : new Date(0);

      if (sortOrder === "newest") {
        return dateB.getTime() - dateA.getTime();
      } else {
        return dateA.getTime() - dateB.getTime();
      }
    });
  })();

  return (
    <div className="min-h-screen bg-background text-black">
      <main className="w-full">
        <Navbar />
        <div className="flex flex-col md:flex-row gap-6 px-6 py-8 mt-10">
          <div className="w-full md:w-[250px]">
            <Filters
              onFilterChange={(newFilters) => {
                setFilters((prev) => ({ ...prev, ...newFilters }));
              }}
            />
          </div>
          <div className="flex-1 flex flex-col gap-6 items-center">
            <div className="bg-card rounded-md w-3/4 p-3">
              <div className="flex flex-col sm:flex-row gap-3 w-full items-center sm:items-center">
                <Input
                  placeholder="Search jobs or companies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 placeholder:text-muted-foreground"
                />
                <Button
                  variant="outline"
                  className="whitespace-nowrap"
                  onClick={handleDateSort}
                >
                  {getSortButtonText()}
                </Button>
              </div>
            </div>
            <div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid gap-x-4 gap-y-4">
              {filteredAndSortedJobs.map((job, i) => {
                const isFavorited = favorites.some(
                  (f) => f.title === job.title && f.url === job.url
                );

                return (
                  <JobCard
                    key={i}
                    jobTitle={job.title}
                    location={`@ ${job.company}`}
                    tags={
                      job.skills
                        ? job.skills
                            .split(",")
                            .slice(0, 3)
                            .map((skill) => ({
                              title: skill.trim(),
                              variant: "default",
                            }))
                        : []
                    }
                    url={job.url}
                    isFavorited={isFavorited}
                    onFavoriteToggle={() => handleFavoriteToggle(job)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
