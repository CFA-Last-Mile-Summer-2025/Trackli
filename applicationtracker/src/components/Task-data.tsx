import { Tag } from "./NewJobCard";

export type TTask = { id: string; content: string; company:string; status: Tag; starred: boolean; };

const taskDataKey = Symbol('task');

export type TTaskData = { [taskDataKey]: true; taskId: TTask['id'] };


export function isTaskData(data: Record<string | symbol, unknown>): data is TTaskData {
  return data[taskDataKey] === true;
}

export async function getTasks(token: string): Promise<TTask[]> {
  const res = await fetch("http://localhost:3002/myjob", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch tasks from server");
  const jobs = await res.json();

  return jobs.map((job: { _id: string; title: string; company: string; status: string; starred: string; }) => ({
    id: job._id,
    content: job.title,
    company: job.company,
    status: {
      title: job.status.toLowerCase(),
      variant: job.status.toLowerCase(),
    },
    starred: job.starred || false,
  }));
}

export function getTaskData(task: TTask): TTaskData {
  return { [taskDataKey]: true, taskId: task.id };
}

