import Navbar from "@/components/Navbar"
import { Pdnd } from "@/components/Pdnd"
import { CardTitle } from "@/components/ui/card"


function ApplicationsPage() {
  return (
    <div>
      <Navbar/>
        <main className="w-full justify-center pt-5">
          <CardTitle className="mt-10 mb-5 text-center font-lalezar text-2xl text-sidebar-foreground/70">Organize your applications here</CardTitle>
          <Pdnd/>
        </main>
    </div>
  )
}

export default ApplicationsPage