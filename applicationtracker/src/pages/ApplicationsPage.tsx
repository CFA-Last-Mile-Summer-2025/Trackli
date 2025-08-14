import { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pdnd } from "@/components/Pdnd";


function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<'list' | 'progress'>('list');

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6FF]">
      <main className="w-full">
        <Navbar />
        
        <div className="px-6 py-8 mt-15">
          <div className="max-w-6xl mx-auto mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Track your applications
            </h1>
            <p className="mb-8">
              Monitor your job application progress and stay organized
            </p>

            <div className="flex gap-2 mb-6">
              <Button 
                variant={activeView === 'list' ? 'default' : 'outline'}
                onClick={() => setActiveView('list')}
                className={
                  activeView === 'list' 
                    ? 'bg-blue-600 hover:bg-blue-700  border-0' 
                    : 'bg-transparent border-secondary-foreground/30  hover:bg-secondary-foreground/10'
                }
              >
                List View
              </Button>
              <Button 
                variant={activeView === 'progress' ? 'default' : 'outline'}
                onClick={() => setActiveView('progress')}
                className={
                  activeView === 'progress' 
                    ? 'bg-blue-600 hover:bg-blue-700 border-0' 
                    : 'bg-transparent border-secondary-foreground/30 hover:bg-secondary-foreground/10'
                }
              >
                Progress View
              </Button>
            </div>
{/*   search bar - does not function and is not UI ready
            <div className="w-full max-w-2xl">
              <div className="rounded-lg p-4 backdrop-blur-md bg-black/30 border border-white/10 shadow-2xl">
                <Input
                  placeholder="Search jobs or companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full placeholder:text-white/70 bg-transparent border-white/20 text-white focus:border-white/40"
                />
              </div>
            </div> */}
          </div>

          <div className="max-w-6xl mx-auto">
            {activeView === 'list' ? (
              <Pdnd />
            ) : (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-[#8B7EC8] to-[#C8A8E9] rounded-lg p-8">
                  <h3 className="text-xl font-semibold mb-2">
                    Progress View Coming Soon
                  </h3>
                  <p className="">
                    This feature will show your applications in a kanban-style board view.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-8 right-8">
          <Button
            size="lg"
            className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <span className="text-2xl font-light">+</span>
          </Button>
        </div>
      </main>
    </div>
  );
}

export default ApplicationsPage;