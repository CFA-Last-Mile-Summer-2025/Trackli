import { useState, useEffect } from "react";
import { AppSidebar } from "../components/app-sidebar";
import JobCard from "../components/NewJobCard";
import TopBar from "../components/TopBar";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";

function App() {
  const [jobs, setJobs] = useState([]);

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
    <div className="min-h-screen bg-white text-black">
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <SidebarTrigger />
          <div className="flex flex-col items-center">
            <div className="flex justify-between">
              <TopBar />
            </div>
            {/* Job Grid */}
            {/* TODO: Make it so that jobcard content is coming from the actual job postings
             * NOTE --- if API does not get set up in time, make individual static ones using a separate array with content */}
            <div className="grid-cols-3 grid gap-4">
              {jobs.map((job, i) => ( // ignore red squigglies this works lol
                <JobCard
                  key={i}
                  jobTitle={`${job.title}`}
                  location={`@ ${job.company}`}
                  tags={
                    job.skills
                      ? job.skills // if skills exists, take the first 3 and make those the tags
                          .split(",")
                          .slice(0, 3)
                          .map((skill) => ({
                            title: skill.trim(),
                          }))
                      : []
                  }
                />
              ))}
            </div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}

export default App;
