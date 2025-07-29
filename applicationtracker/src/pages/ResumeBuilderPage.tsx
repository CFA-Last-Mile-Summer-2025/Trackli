import Navbar from "@/components/Navbar"
import ResumeChat from "@/components/Chatbox"
import ResumeBuilderForm from "@/components/ResumeBuilderForm"

function ResumeBuilderPage() {
  return (
    <div>
      <Navbar/>
      <main className="w-full">
          <ResumeBuilderForm/>
      </main>
    <ResumeChat />


    </div>
  )
}

export default ResumeBuilderPage