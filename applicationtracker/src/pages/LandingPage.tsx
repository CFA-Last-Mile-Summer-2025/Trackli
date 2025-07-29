import Landing from "@/components/Landing"
import Navbar from "@/components/Navbar"

function LandingPage() {
  return (
    <div>
      <Navbar/>
      <main className="w-full">
        <Landing/>
      </main>
    </div>
  )
}

export default LandingPage;