import Navbar from "@/components/Navbar"
import ResumeChat from "@/components/Chatbox"
import ResumeBuilder from "@/components/ResumeBuilder"

function ResumeBuilderPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[url(assets/gradientBg.svg)] bg-cover bg-no-repeat bg-center">
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
