import { useState, useEffect } from "react";
import { AppSidebar } from "../components/app-sidebar";
import JobCard from "../components/NewJobCard";
import TopBar from "../components/TopBar";
import AddJobForm from "@/components/AddJobForm";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";

interface Job {
  title: string;
  company: string;
  skills?: string;
  location: string;
  url: string;
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
      console.log(data);
      fetchJobs();
      // Update offset in state and localStorage
      const newOffset = offset + 10;
      setOffset(newOffset);
      console.log(newOffset);
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

  useEffect(() => {
    fetchJobs();
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
              {jobs.map(
                (
                  job,
                  i // ignore red squigglies this works lol
                ) => (
                  <JobCard
                    key={i}
                    jobTitle={`${job.title}`}
                    location={`@ ${job.company}`}
                    tags={
                      job.skills
                        ? job.skills
                            .split(",")
                            .slice(0, 3)
                            .map((skill) => ({
                              title: skill.trim(),
                              variant: "default", // or "progress"/"urgent" based on logic if needed
                            }))
                        : []
                    }
                    url={`${job.url}`}
                  />
                )
              )}
            </div>
          </div>
          <button onClick={handleLoadMoreJobs}>Load More Jobs</button>
        </main>
      </SidebarProvider>
    </div>
  );
}

export default App;
