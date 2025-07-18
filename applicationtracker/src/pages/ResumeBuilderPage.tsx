import Navbar from "@/components/Navbar"
import ResumeBuilderForm from "@/components/ResumeBuilderForm"

function ResumeBuilderPage() {
  return (
    <div>
      <Navbar/>
      <main className="w-full">
          <ResumeBuilderForm/>
      </main>
    </div>
  )
}

export default ResumeBuilderPage