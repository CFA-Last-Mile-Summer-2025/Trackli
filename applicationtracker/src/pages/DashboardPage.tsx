import Dashboard from "@/components/Dashboard"
import Navbar from "@/components/Navbar"

function DashboardPage() {
  return (
    <div>
      <Navbar/>
      <main className="w-full">
        <Dashboard/>
      </main>
    </div>
  )
}

export default DashboardPage;