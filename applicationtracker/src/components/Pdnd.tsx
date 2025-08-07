import { useEffect, useState } from "react";
import { getTasks, type TTask } from "./Task-data";
import { Task } from "./Task";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { isTaskData } from "./Task-data";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
import { flushSync } from "react-dom";
import { fetchWithAuth } from "@/utils/tokenChecker";

export function Pdnd() {
  const [tasks, setTasks] = useState<TTask[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const data = await getTasks(token);
        setTasks(data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };

    fetchTasks();
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

  return (
    <div className="pt-6 my-0 mx-auto w-[900px]">
      <div className="grid grid-cols-[3fr_2fr_1fr_1fr_auto] text-xs font-semibold text-slate-500 px-4 py-2 border border-slate-300 border-b-0 rounded-t-md bg-slate-50">
        <span>Job Title</span>
        <span>Company</span>
        <span>Status</span>
        <span className="text-center">Starred</span>
        <span className="text-center">Actions</span>
      </div>

      <div className="flex flex-col gap-2 border-x border-b border-slate-300 rounded-b-md">
        {tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
