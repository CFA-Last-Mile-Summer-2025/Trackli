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
  url: string;
  _id?: string;
}

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
  const [filters, setFilters] = useState({
    location: "",
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

  useEffect(() => {
    fetchJobs();
    fetchFavorites();
  }, []);

  // --- Add filteredJobs for search functionality ---
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());

    const matchesLocation =
      !filters.location || job.location === filters.location;

    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-background text-black">
      <main className="w-full">
        <Navbar />
        <div className="flex flex-col md:flex-row gap-6 px-6 py-8">
          <div className="w-full md:w-[250px]">
            <Filters
              onFilterChange={(newFilters) => {
                setFilters((prev) => ({ ...prev, ...newFilters }));
              }}
            />
          </div>
          <div className="flex-1 flex flex-col gap-6">
            {/* <div className="flex justify-between">
              <TopBar results={setJobs} />
            </div> */}
            <div className="flex flex-col sm:flex-row gap-3 w-full items-stretch sm:items-center">
              <Input
                placeholder="Search jobs or companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleLoadMoreJobs} className="mt-2 w-fit">
                TEST Load More Jobs
              </Button>

              <Button variant="outline" className="whitespace-nowrap">
                Sort by Date
              </Button>
            </div>
            <div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid gap-x-4 gap-y-4">
              {filteredJobs.map((job, i) => {
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
