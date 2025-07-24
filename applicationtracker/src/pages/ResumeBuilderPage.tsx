import { AppSidebar } from "@/components/app-sidebar"
import ResumeChat from "@/components/Chatbox"
import ResumeBuilderForm from "@/components/ResumeBuilderForm"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

function ResumeBuilderPage() {
  return (
    <div>
      <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
          <ResumeBuilderForm/>
      </main>
    <ResumeChat />

    </SidebarProvider>

    </div>
  )
}

export default ResumeBuilderPage