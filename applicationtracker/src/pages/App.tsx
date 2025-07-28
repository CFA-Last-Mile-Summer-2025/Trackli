import { useState, useEffect } from "react";
import { AppSidebar } from "../components/app-sidebar";
import JobCard from "../components/NewJobCard";
import TopBar from "../components/TopBar";
import AddJobForm from "@/components/AddJobForm";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
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
      const arrayData = Array.isArray(data)? data : []
      setFavorites(arrayData);
      console.log("Number of favorites:", arrayData.length, arrayData, );
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
        await fetch(`http://localhost:3002/favorite/${matched._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        await fetch("http://localhost:3002/addFavorite", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  return (
    <div className="min-h-screen bg-white text-black">
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <SidebarTrigger />
          <div className="flex flex-col items-center">
            <div className="flex justify-between">
              <TopBar results={setJobs} />
            </div>
            {/* Job Grid */}
            {/* TODO: Make it so that jobcard content is coming from the actual job postings
             * NOTE --- if API does not get set up in time, make individual static ones using a separate array with content */}
            <div className="grid-cols-3 grid gap-4">
              {jobs.map((job, i) => {
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
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                );
              })}
            </div>
          </div>
          <button onClick={handleLoadMoreJobs}>Load More Jobs</button>
        </main>
      </SidebarProvider>
    </div>
  );
}

export default App;
