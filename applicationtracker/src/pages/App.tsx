import { useState, useEffect } from "react";
import { AppSidebar } from "../components/app-sidebar";
import JobCard from "../components/NewJobCard";
import TopBar from "../components/TopBar";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";

interface Job {
  title: string;
  company: string;
  skills?: string;
  location: string;
}

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    company: "",
  });

  // Update above listed filters with whatever dropdown option is selected
  const handleFilterChange = (filter: keyof typeof filters, value: string) => {
    const updated = Object.assign({}, filters);
    updated[filter] = value;
    setFilters(updated);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchSearch =
      !search ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());

    // This is remote/hybrid/inperson: https://developers.google.com/search/docs/appearance/structured-data/job-posting#job-posting-definition
    // (However, I don't think (?) there's an actual inperson tag so maybe anything that isnt marked
    // TELECOMMUTE is in person/hybrid which messes things up )
    const matchLocationType =
      !filters.location ||
      job.location?.toLowerCase().includes(filters.location.toLowerCase());

    const matchCompanyName =
      !filters.company ||
      job.company.toLowerCase().includes(filters.company.toLowerCase());

    return matchSearch && matchLocationType && matchCompanyName;
  });

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
              <TopBar
                search={search}
                onSearchChange={setSearch}
                location={filters.location}
                onFilterChange={handleFilterChange}
              />
            </div>
            {/* Job Grid */}
            {/* TODO: Make it so that jobcard content is coming from the actual job postings
             * NOTE --- if API does not get set up in time, make individual static ones using a separate array with content */}
            <div className="grid-cols-3 grid gap-4">
              {/* */}
              {filteredJobs.map((job, i) => (
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
                            variant: "default",
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
