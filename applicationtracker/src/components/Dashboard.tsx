"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { href, Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { fetchWithAuth } from "@/utils/tokenChecker";
import { BarChartDisplay } from "@/components/BarChartDisplay";

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

  const handleViewJobDetails = async () => {
    if (suggestedJob) {
      try {
        // Add to viewed jobs when user clicks details
        await fetchWithAuth("http://localhost:3002/viewed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: suggestedJob.title,
            company: suggestedJob.company,
            location: suggestedJob.location,
            url: suggestedJob.url,
            skills: suggestedJob.skills,
            job_type: suggestedJob.job_type,
            description_text: suggestedJob.description_text,
            experience_level: suggestedJob.experience_level,
          }),
        });

        // Open job URL in new tab
        if (suggestedJob.url && suggestedJob.url !== "N/A") {
          window.open(suggestedJob.url, "_blank");
        }
      } catch (err) {
        console.error("Error tracking job view:", err);
        // Still open the job even if tracking fails
        if (suggestedJob.url && suggestedJob.url !== "N/A") {
          window.open(suggestedJob.url, "_blank");
        }
      }
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
    <main className="max-w-6xl mx-auto p-6 space-y-6 mt-15">
      <section className="text-center space-y-1">
        <h1 className="text-2xl font-semibold">Welcome back, {username}</h1>
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
                  <Button
                    className="h-[30px] w-full"
                    onClick={handleViewJobDetails}
                  >
                    View Details
                  </Button>
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

      <Separator />

      <section>
        <Card>
          <CardHeader>
            <CardTitle>This Week’s Application Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 items-center py-10">
              <div className="col-span-1">
                <BarChartDisplay data={barChartData} />
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
