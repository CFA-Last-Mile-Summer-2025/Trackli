import { Tag } from "./NewJobCard";
import { fetchWithAuth } from "@/utils/tokenChecker";

export type TTask = {
  id: string;
  content: string;
  company: string;
  status: Tag;
  starred: boolean;
  skills?: string;
  job_type?: string;
  url: string;
};

const taskDataKey = Symbol("task");

export type TTaskData = { [taskDataKey]: true; taskId: TTask["id"] };

export function isTaskData(
  data: Record<string | symbol, unknown>
): data is TTaskData {
  return data[taskDataKey] === true;
}

export async function getTasks(token: string): Promise<TTask[]> {
  const myJobsRes = await fetchWithAuth("http://localhost:3002/myjob");
  const favRes = await fetchWithAuth("http://localhost:3002/favorite");

  const myJobs = await myJobsRes.json();
  const favJobs = await favRes.json();

  const favSet = new Set(
    favJobs.map((fav: any) => `${fav.title}-${fav.url}`)
  );

  return myJobs.map(
    (job: {
      _id: string;
      title: string;
      company: string;
      status: string;
      starred: string;
      skills: string;
      job_type: string,
      url: string;
    }) => ({
      id: job._id,
      title: job.title,
      content: job.title,
      company: job.company,
      skills: job.skills,
      job_type: job.job_type,
      url: job.url,
      status: {
        title: job.status.toLowerCase(),
        variant: job.status.toLowerCase(),
      },
      starred: favSet.has(`${job.title}-${job.url}`),
    })
  );
}

export function getTaskData(task: TTask): TTaskData {
  return { [taskDataKey]: true, taskId: task.id };
}
