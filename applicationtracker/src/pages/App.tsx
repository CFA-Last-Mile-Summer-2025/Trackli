import Navbar from "@/components/Navbar"
import JobCard from "../components/NewJobCard"
import TopBar from "../components/TopBar"
import AddJobForm from "@/components/AddJobForm";
import { useEffect, useState } from "react";

interface Job {
  title: string;
  company: string;
  skills?: string;
  location: string;
  url: string;
}

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:3002/listings"); // gh pages will prob need this to be changed if we want hosting
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-background text-black">
      <main className="w-full">
        <Navbar/>
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
      </main>

    </div>
  );
}

export default App;
