import Banner from "@/components/Banner";
import { useEffect, useState } from "react";
import Dashboard from "@/components/Dashboard";
import Navbar from "@/components/Navbar";
import { fetchWithAuth } from "@/utils/tokenChecker";

function DashboardPage() {
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const getUsername = async () => {
      const usernameRes = await fetchWithAuth("http://localhost:3002/username");
      if (!usernameRes.ok) throw new Error("Failed to fetch username");

      const usernameData = await usernameRes.json();
      const displayName = usernameData.name.includes("@")
        ? usernameData.name.split("@")[0]
        : usernameData.name;
      setUsername(displayName);
    };

    getUsername();
  }, []);

  return (
    <div className="bg-[#F8F6FF]">
      <Navbar />
      <Banner
        title={`Welcome back, ${username}`}
        subtitle={"Track your job applications and discover new opportunities"}
      />

      <main className="w-full min-h-screen">
        <Dashboard />
      </main>
    </div>
  );
}

export default DashboardPage;
