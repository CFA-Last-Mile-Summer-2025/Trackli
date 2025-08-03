"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { href, Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { fetchWithAuth } from "@/utils/tokenChecker";

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
    <main className="max-w-6xl mx-auto p-6 space-y-6 mt-15">

      <section className="text-center space-y-1">
        <h1 className="text-2xl font-semibold">Welcome back, User</h1>
        <p className="text-muted-foreground text-sm">
          Track your job applications and discover new opportunities
        </p>
      </section>

      {/* Scrollable section for recent jobs or not? */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
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
              <p className="text-sm text-muted-foreground">
                No recent jobs found.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 text-center space-y-7">
              <h2 className="text-md font-semibold mt-2">
                Keep pushing forward!
              </h2>
              <p className="text-sm text-muted-foreground">
                New opportunities are waiting for you.
              </p>
              <Link to={"/jobs"}>
                <Button size="sm">See more jobs</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Suggested Job</CardTitle>
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

      <Separator />

      <section>
        <Card>
          <CardHeader>
            <CardTitle>This Week’s Application Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 items-center py-10">
              <div className="bg-muted text-muted-foreground text-center py-12">
                add bar chart lol
              </div>
              <div className="space-y-2 text-center">
                <div className="text-3xl font-bold">{appliedWeekCount}</div>
                <p className="text-sm text-muted-foreground">Applied</p>
              </div>
              <div className="space-y-2 text-center">
                <div className="text-3xl font-bold">{viewedWeekCount}</div>
                <p className="text-sm text-muted-foreground">Viewed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
