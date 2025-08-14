import Navbar from "@/components/Navbar"
import ResumeChat from "@/components/Chatbox"
import ResumeBuilder from "@/components/ResumeBuilder"

function ResumeBuilderPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6FF]">
      <Navbar />

      <div className="flex-1 flex flex-col">
        <ResumeBuilder />

        <div className="mt-auto">
          <ResumeChat />
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilderPage
