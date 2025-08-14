import { useEffect, useMemo, useState } from "react";
import { getTasks, type TTask } from "./Task-data";
import { Task } from "./Task";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { isTaskData } from "./Task-data";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
import { flushSync } from "react-dom";
import { fetchWithAuth } from "@/utils/tokenChecker";
import { Input } from './ui/input';
import { Button } from './ui/button';

export function Pdnd() {
  const [tasks, setTasks] = useState<TTask[]>([]);

  const refreshTasks = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const data = await getTasks(token);
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return isTaskData(source.data);
      },
      async onDrop({ location, source }) {
        const target = location.current.dropTargets[0];
        if (!target) return;

        const sourceData = source.data;
        const targetData = target.data;
        if (!isTaskData(sourceData) || !isTaskData(targetData)) return;

        const indexOfSource = tasks.findIndex(
          (t) => t.id === sourceData.taskId
        );
        const indexOfTarget = tasks.findIndex(
          (t) => t.id === targetData.taskId
        );
        if (indexOfSource < 0 || indexOfTarget < 0) return;

        const closestEdge = extractClosestEdge(targetData);

        let newTasks: TTask[] = [];
        flushSync(() => {
          newTasks = reorderWithEdge({
            list: tasks,
            startIndex: indexOfSource,
            indexOfTarget,
            closestEdgeOfTarget: closestEdge,
            axis: "vertical",
          });
          setTasks(newTasks);
        });

        try {
          const orderedIds = newTasks.map((task) => task.id);

          await fetchWithAuth(`http://localhost:3002/myjob/reorder`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderedIds }),
          });
        } catch (err) {
          console.error("Reorder route failure:", err);
        }
      },
    });
  }, [tasks]);

  const [search, setSearch] = useState("");

  const filteredTasks = useMemo(() => {
    if (!search.trim()) {
      return tasks;
    }

    const searchLower = search.toLowerCase().trim();
    
    return tasks.filter((task) => {
      const jobTitle = (task.content || '').toLowerCase(); // content is the job title
      const company = (task.company || '').toLowerCase();
      
      return (
        jobTitle.includes(searchLower) || 
        company.includes(searchLower)
      );
    });
  }, [tasks, search]);


  return (
    <div className="pt-6 my-0 mx-auto w-[900px]">
      <div className='bg-white border border-white/10 border-b-0 rounded-t-lg'>
         <div className="rounded-md w-[900px] p-3 backdrop-blur-lg bg-white/20 border-white/30 max-w-4xl ">
              <div className="flex flex-col sm:flex-row gap-3 w-full items-center sm:items-center ">
                <Input
                  placeholder="Search jobs or companies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 placeholder:text-muted-foreground"
                />
              </div>
          </div>
        <div className="grid grid-cols-[3fr_2fr_1fr_1fr_auto] text-sm font-medium px-6 py-4">
          <span>Job Title</span>
          <span>Company</span>
          <span>Status</span>
          <span className="text-center">Starred</span>
          <span className="text-center">Actions</span>
        </div>

        <div className="flex flex-col rounded-b-lg bg-white">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <div key={task.id} className="relative">
                <Task 
                  task={task} 
                  onRefresh={refreshTasks}
                  isLastItems={index >= filteredTasks.length - 3}
                />
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              {search ? (
                <div>
                  <p>No jobs found matching "{search}"</p>
                </div>
              ) : (
                <p>No jobs available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}