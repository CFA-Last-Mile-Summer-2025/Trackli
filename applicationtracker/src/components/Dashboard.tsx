'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Status } from './Status';
import { href, Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">

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
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex justify-between items-center rounded px-4 py-2"
              >
                <div>
                  <p className="font-medium">Position</p>
                  <p className="text-sm text-muted-foreground">Company — Location</p>
                </div>
                <Status status='offer'/>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 text-center space-y-7">
              <h2 className="text-md font-semibold mt-2">Keep pushing forward!</h2>
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
              <p className="text-sm text-muted-foreground mb-3">Company — Location</p>
              {/* add route to reach job card so user can view details and apply */}
              <Button className='h-[30px]'> Details </Button>
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
                <div className="text-3xl font-bold">8</div>
                <p className="text-sm text-muted-foreground">Applied</p>
              </div>
              <div className="space-y-2 text-center">
                <div className="text-3xl font-bold">12</div>
                <p className="text-sm text-muted-foreground">Viewed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
