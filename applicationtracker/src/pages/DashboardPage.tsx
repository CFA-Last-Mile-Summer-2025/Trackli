import Banner from "@/components/Banner";
import Dashboard from "@/components/Dashboard"
import Navbar from "@/components/Navbar"

function DashboardPage() {
  return (
    <div className="bg-[#F8F6FF]">
      <Navbar/>
      <Banner title={"Welcome back, User"} subtitle={"Track your job applications and discover new opportunities"}/>
      
      <main className="w-full min-h-screen">
        <Dashboard/>
      </main>
    </div>
  )
}

export default DashboardPage;