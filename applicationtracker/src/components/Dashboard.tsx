"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { href, Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { fetchWithAuth } from "@/utils/tokenChecker";
import { BarChartDisplay } from "@/components/BarChartDisplay";
import LinkWarning from "./LinkWarning";
import { WeeklyGoal } from "./WeeklyGoal";

export default function Dashboard() {
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [viewedWeekCount, setViewedWeekCount] = useState(0);
  const [appliedWeekCount, setAppliedWeekCount] = useState(0);
  const [username, setUsername] = useState("User");
  const [barChartData, setBarChartData] = useState<
    { day: string; desktop: number }[]
  >([]);
  const [suggestedJob, setSuggestedJob] = useState<any>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(true);

  const loadDashboardData = async () => {
    // Fetch username
    try {
      const usernameRes = await fetchWithAuth("http://localhost:3002/username");
      const usernameData = await usernameRes.json();
      const displayName = usernameData.name.includes("@")
        ? usernameData.name.split("@")[0]
        : usernameData.name;
      setUsername(displayName);

      // Fetch applied count
      const appliedRes = await fetchWithAuth(
        "http://localhost:3002/applied/recentWeek"
      );
      const appliedData = await appliedRes.json();

      setAppliedWeekCount(appliedData);
      // Fetch viewed count
      const viewedRes = await fetchWithAuth(
        "http://localhost:3002/viewed/recentWeek"
      );
      const viewedData = await viewedRes.json();

      setViewedWeekCount(viewedData);
      // Fetch recent jobs
      const jobsRes = await fetchWithAuth("http://localhost:3002/myjob/recent");
      const jobsData = await jobsRes.json();
      if (jobsData != null) {
        setRecentJobs(jobsData.slice(0, 4));
      }

      const chartRes = await fetchWithAuth(
        "http://localhost:3002/applied/weekly-breakdown"
      );
      const chartData = await chartRes.json();
      setBarChartData(chartData);

      const suggestionRes = await fetchWithAuth(
        "http://localhost:3002/jobs/random"
      );
      const suggestionData = await suggestionRes.json();
      setSuggestedJob(suggestionData);
      setLoadingSuggestion(false);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  const getNewSuggestion = async () => {
    setLoadingSuggestion(true);
    try {
      const suggestionRes = await fetchWithAuth(
        "http://localhost:3002/jobs/random"
      );
      const suggestionData = await suggestionRes.json();
      setSuggestedJob(suggestionData);
    } catch (err) {
      console.error("Error fetching new suggestion:", err);
    }
    setLoadingSuggestion(false);
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
            <div className="text-3xl font-bold">{appliedWeekCount}</div>
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
                <BarChartDisplay data={barChartData} />
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
          {/* <Card className="rounded-lg p-4 space-y-4 backdrop-blur-lg bg-white/20 border-white/30 shadow-2xl">
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
          </Card> */}
          <WeeklyGoal appliedWeekCount={appliedWeekCount}/>

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
              {loadingSuggestion ? (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              ) : suggestedJob ? (
                <>
                  <p className="font-medium">{suggestedJob.title}</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {suggestedJob.company} — {suggestedJob.location || "Remote"}
                  </p>
                  <LinkWarning href={suggestedJob.url} job={suggestedJob}>
                    <Button className="h-[30px] w-full">View Details</Button>
                  </LinkWarning>
                </>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    No suggestions available
                  </p>
                  <Button
                    className="h-[30px] w-full"
                    variant="outline"
                    onClick={getNewSuggestion}
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

function groupJobsByDayOfWeek(jobs: any[]) {
  const dayMap: Record<string, number> = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  };

  jobs.forEach((job) => {
    const date = new Date(job.dateApplied || job.createdAt);
    const day = date.toLocaleDateString("en-US", { weekday: "long" });
    dayMap[day] += 1;
  });

  return Object.entries(dayMap).map(([day, count]) => ({
    month: day,
    desktop: count,
  }));
}
