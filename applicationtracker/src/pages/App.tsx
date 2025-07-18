import Navbar from "@/components/Navbar"
import JobCard from "../components/NewJobCard"
import TopBar from "../components/TopBar"

function App() {
  return (
    <div className="min-h-screen bg-background text-black">
      <main className="w-full">
        <Navbar/>
        <div className="flex flex-col items-center">
            <div className="flex justify-between">
              <TopBar/>
            </div>
            {/* TODO: Make it so that jobcard content is coming from the actual job postings 
            * NOTE --- if API does not get set up in time, make individual static ones using a separate array with content */}
            <div className=" grid-cols-3 grid gap-4">
                  {Array.from({ length: 10 }).map(() => (
                  <JobCard jobTitle="AI Platform Software Engineer Intern" location="@ Docusign washington" tags={[{ title: "In progress", variant: "progress" }, { title: "AI/ML", variant: undefined }, { title: "Urgent", variant: "urgent" }]} />
                ))}
            </div>
        </div>
      </main>

    </div>
  )
}

export default App