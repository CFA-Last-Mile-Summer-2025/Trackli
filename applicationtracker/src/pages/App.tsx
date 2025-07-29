// import Navbar from "@/components/Navbar"
// import JobCard from "../components/NewJobCard"
// import TopBar from "../components/TopBar"
// import AddJobForm from "@/components/AddJobForm";
// import { useEffect, useState } from "react";
// import Filters from "@/components/Filters";

// interface Job {
//   title: string;
//   company: string;
//   skills?: string;
//   location: string;
//   url: string;
// }

// function App() {
//   const [jobs, setJobs] = useState<Job[]>([]);

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const res = await fetch("http://localhost:3002/listings"); // gh pages will prob need this to be changed if we want hosting
//         const data = await res.json();
//         setJobs(data);
//       } catch (err) {
//         console.error("Failed to fetch jobs:", err);
//       }
//     };

//     fetchJobs();
//   }, []);

//   return (
//     <div className="min-h-screen bg-background text-black">
//       <main className="w-full">
//         <Navbar/>
//         <Filters/>
//         <div className="flex flex-col items-center">
//             <div className="flex justify-between">
//               <TopBar results={setJobs} />
//             </div>
//             {/* Job Grid */}
//             {/* TODO: Make it so that jobcard content is coming from the actual job postings
//              * NOTE --- if API does not get set up in time, make individual static ones using a separate array with content */}
//             <div className="grid-cols-3 grid gap-4">
//               {jobs.map(
//                 (
//                   job,
//                   i // ignore red squigglies this works lol
//                 ) => (
//                   <JobCard
//                     key={i}
//                     jobTitle={`${job.title}`}
//                     location={`@ ${job.company}`}
//                     tags={
//                       job.skills
//                         ? job.skills
//                             .split(",")
//                             .slice(0, 3)
//                             .map((skill) => ({
//                               title: skill.trim(),
//                               variant: "default", // or "progress"/"urgent" based on logic if needed
//                             }))
//                         : []
//                     }
//                     url={`${job.url}`}
//                   />
//                 )
//               )}
//               {/** testing */}
//                   <JobCard
//                     key={1}
//                     jobTitle={`job title`}
//                     location={`@ company`}
//                     tags={
//                       [{title:'tag1', variant:"default"},{title:'tag1', variant:"default"},{title:'tag1', variant:"default"},]
//                     }
//                     url={`https://google.com`}
//                   />
//             </div>
//         </div>
//       </main>

//     </div>
//   );
// }

// export default App;
import Navbar from "@/components/Navbar"
import JobCard from "../components/NewJobCard"
import TopBar from "../components/TopBar"
import AddJobForm from "@/components/AddJobForm"
import { useEffect, useState } from "react"
import Filters from "@/components/Filters"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Job {
  title: string
  company: string
  skills?: string
  location: string
  url: string
}

function App() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:3002/listings")
        const data = await res.json()
        setJobs(data)
      } catch (err) {
        console.error("Failed to fetch jobs:", err)
      }
    }

    fetchJobs()
  }, [])

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.skills?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background text-black">
      <main className="w-full">
        <Navbar />
        <div className="flex flex-col md:flex-row gap-6 px-6 py-8">
          <div className="w-full md:w-[250px]">
            <Filters onFilterChange={(newFilters) => {
              // implement real filtering here based on newFilters
              console.log("Filters updated:", newFilters);
            }} />
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
              <Button variant="outline" className="whitespace-nowrap">
                Sort by Date
              </Button>
            </div>
            <div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid gap-x-4 gap-y-4">
              {filteredJobs.map((job, i) => (
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
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
