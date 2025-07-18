export type TStatus = 'applied' | 'interview' | 'offer' | 'accepted' | 'closed';
export type TTask = { id: string; content: string; company:string; status: TStatus; starred: boolean; };

const taskDataKey = Symbol('task');

export type TTaskData = { [taskDataKey]: true; taskId: TTask['id'] };

export function getTaskData(task: TTask): TTaskData {
  return { [taskDataKey]: true, taskId: task.id };
}

export function isTaskData(data: Record<string | symbol, unknown>): data is TTaskData {
  return data[taskDataKey] === true;
}

const tasks: TTask[] = [
  { id: 'task-0', content: 'Organize a team-building event', company: "Google", status: 'applied', starred: false },
  { id: 'task-1', content: 'Create and maintain office inventory', company: "Google", status: 'offer', starred: false  },
  { id: 'task-2', content: 'Update company website content', company: "Google", status: 'interview', starred: true  },
  { id: 'task-3', content: 'Plan and execute marketing campaigns', company: "Google", status: 'interview', starred: false  },
  { id: 'task-4', content: 'Coordinate employee training sessions', company: "Google", status: 'applied', starred: true  },
  { id: 'task-5', content: 'Manage facility maintenance', company: "Google", status: 'closed', starred: true  },
  { id: 'task-6', content: 'Organize customer feedback surveys', company: "Google", status: 'accepted', starred: false  },
  { id: 'task-7', content: 'Coordinate travel arrangements', company: "Google", status: 'closed', starred: true  },
];

export function getTasks() {
  return tasks;
}
