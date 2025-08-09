import { useEffect, useState } from 'react';
import { getTasks, type TTask } from './Task-data';
import { Task } from './Task';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { isTaskData } from './Task-data';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
import { flushSync } from 'react-dom';

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
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0];
        if (!target) return;

        const sourceData = source.data;
        const targetData = target.data;
        if (!isTaskData(sourceData) || !isTaskData(targetData)) return;

        const indexOfSource = tasks.findIndex((t) => t.id === sourceData.taskId);
        const indexOfTarget = tasks.findIndex((t) => t.id === targetData.taskId);
        if (indexOfSource < 0 || indexOfTarget < 0) return;

        const closestEdge = extractClosestEdge(targetData);

        flushSync(() => {
          setTasks(
            reorderWithEdge({
              list: tasks,
              startIndex: indexOfSource,
              indexOfTarget,
              closestEdgeOfTarget: closestEdge,
              axis: 'vertical',
            }),
          );
        });
      },
    });
  }, [tasks]);

  return (
    <div className="pt-6 my-0 mx-auto w-[900px]">
      <div className="grid grid-cols-[3fr_2fr_1fr_1fr_auto] text-sm font-medium text-white/50 px-6 py-4 backdrop-blur-md bg-black/30 border border-white/10 border-b-0 rounded-t-lg">
        <span>Job Title</span>
        <span>Company</span>
        <span>Status</span>
        <span className="text-center">Starred</span>
        <span className="text-center">Actions</span>
      </div>

      <div className="flex flex-col backdrop-blur-md bg-black/20 border-x border-b border-white/10 rounded-b-lg">
        {tasks.map((task, index) => (
          <div key={task.id} className="relative">
            <Task 
              task={task} 
              onRefresh={refreshTasks}
              isLastItems={index >= tasks.length - 3}
            />
          </div>
        ))}
      </div>
    </div>
  );
}