"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { href, Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { fetchWithAuth } from "@/utils/tokenChecker";
import { BarChartDisplay } from "./BarChartDisplay";

export default function Dashboard() {
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [viewedWeekCount, setViewedWeekCount] = useState(0);
  const [appliedWeekCount, setAppliedWeekCount] = useState(0);

  const loadDashboardData = async () => {
    try {
      // Fetch applied count
      const appliedRes = await fetchWithAuth("http://localhost:3002/applied/recentWeek");
      const appliedData = await appliedRes.json();

      setAppliedWeekCount(appliedData);
      // Fetch viewed count
      const viewedRes = await fetchWithAuth( "http://localhost:3002/viewed/recentWeek");
      const viewedData = await viewedRes.json();

      setViewedWeekCount(viewedData);
      // Fetch recent jobs
      const jobsRes = await fetchWithAuth("http://localhost:3002/myjob/recent");
      const jobsData = await jobsRes.json();
      if (jobsData != null) {
        setRecentJobs(jobsData.slice(0,4));
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };
  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <section className="grid grid-cols-4 gap-6">
        <Card className="rounded-lg p-4 backdrop-blur-lg bg-white/20 border-white/30 shadow-2xl">
          <CardContent className="p-2 text-center">
            {/* Add total applied count */}
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-muted-foreground">Total Applied</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg p-4 backdrop-blur-lg bg-white/20 border-white/30 shadow-2xl">
          <CardContent className="p-2 text-center">
            {/* Add interview count */}
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-muted-foreground">Interviews</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg p-4 backdrop-blur-lg bg-white/20 border-white/30 shadow-2xl">
          <CardContent className="p-2 text-center">
            {/* Add offers count */}
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-muted-foreground">Offers</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg p-4 backdrop-blur-lg bg-white/20 border-white/30 shadow-2xl">
          <CardContent className="p-2 text-center">
            {/* Add this week total applied count */}
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-muted-foreground">This Week</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-lg p-4 space-y-4 backdrop-blur-lg bg-white/20 border-white/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-black">This Week's Application Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 items-center">
                  <BarChartDisplay/>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 rounded-lg p-4 space-y-4 backdrop-blur-lg bg-white/20 border-white/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-primary">Recent Applications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentJobs.length > 0 ? (
                recentJobs.map((job, i) => (
                  <div
                    key={job._id || i}
                    className="flex justify-between items-center rounded px-4 py-2"
                  >
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {job.company} — {job.location || "N/A"}
                      </p>
                    </div>
                    {/* need to somehow change variant as status is changed */}
                    <Badge variant={job.status}>{job.status || "Pending"}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-black/60">
                  No recent jobs found.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-lg p-4 space-y-4 backdrop-blur-lg bg-white/20 border-white/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-black">Weekly Goal</CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-center space-y-4">
              <div className="w-16 h-16 bg-purple-400 rounded-full mx-auto flex items-center justify-center">
                <span className="text-black text-2xl">💼</span>
              </div>
              <p className="text-sm text-black/60">
                Applications this week
              </p>
              <p className="text-black/80 text-sm">
                Keep it up!
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-lg p-4 space-y-4 backdrop-blur-lg bg-white/20 border-white/30 shadow-2xl">
              <CardTitle className="text-black pl-5 pt-2">Quick Actions</CardTitle>
            <CardContent className="space-y-3 flex flex-col ">
              <Link to={"/jobs"} className="w-full justify-start bg-white/20 hover:bg-white/30 text-black border-white/30 shadow-lg rounded-md p-3">
                📝 Add New Application
              </Link>
              <Link to={"/resumebuilder"} className="w-full justify-start bg-white/20 hover:bg-white/30 text-black border-white/30 shadow-lg rounded-md p-3">
                📋 Update Resume  
              </Link>
              <Link to={'/applications'} className="w-full justify-start bg-white/20 hover:bg-white/30 text-black border-white/30 shadow-lg rounded-md p-3">
                📊 View All Applications
              </Link>
            </CardContent>
          </Card>

          <Card className="rounded-lg p-4 space-y-4 backdrop-blur-lg bg-white/20 border-white/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-black">Suggested Job</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 mb-5">
              <p className="font-medium">Position</p>
              <p className="text-sm text-muted-foreground mb-3">
                Company — Location
              </p>
              {/* add route to reach job card so user can view details and apply */}
              <Button className="h-[30px]"> Details </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}