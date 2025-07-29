import { GripVertical, MoreVertical, Star, StarOff } from 'lucide-react';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { type HTMLAttributes, useEffect, useRef, useState } from 'react';
import invariant from 'tiny-invariant';
import { createPortal } from 'react-dom';
import {
  attachClosestEdge,
  type Edge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { getTaskData, isTaskData, type TTask } from './Task-data';
import { Badge } from './ui/badge';

type TaskState =
  | { type: 'idle' }
  | { type: 'preview'; container: HTMLElement }
  | { type: 'is-dragging' }
  | { type: 'is-dragging-over'; closestEdge: Edge | null };

const stateStyles: { [Key in TaskState['type']]?: HTMLAttributes<HTMLDivElement>['className'] } = {
  'is-dragging': 'opacity-40',
};

const idle: TaskState = { type: 'idle' };

export function Task({ task }: { task: TTask }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<TaskState>(idle);
  const [menuOpen, setMenuOpen] = useState(false);
  const [starred, setStarred] = useState(task.starred ?? false);

  useEffect(() => {
    const element = ref.current;
    invariant(element);
    return combine(
      draggable({
        element,
        getInitialData() {
          return getTaskData(task);
        },
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({ x: '16px', y: '8px' }),
            render({ container }) {
              setState({ type: 'preview', container });
            },
          });
        },
        onDragStart() {
          setState({ type: 'is-dragging' });
        },
        onDrop() {
          setState(idle);
        },
      }),
      dropTargetForElements({
        element,
        canDrop({ source }) {
          return source.element !== element && isTaskData(source.data);
        },
        getData({ input }) {
          return attachClosestEdge(getTaskData(task), {
            element,
            input,
            allowedEdges: ['top', 'bottom'],
          });
        },
        getIsSticky: () => true,
        onDragEnter({ self }) {
          setState({ type: 'is-dragging-over', closestEdge: extractClosestEdge(self.data) });
        },
        onDrag({ self }) {
          const closestEdge = extractClosestEdge(self.data);
          setState((current) =>
            current.type === 'is-dragging-over' && current.closestEdge === closestEdge
              ? current
              : { type: 'is-dragging-over', closestEdge }
          );
        },
        onDragLeave: () => setState(idle),
        onDrop: () => setState(idle),
      })
    );
  }, [task]);

  //TODO change this to edit actual job status
  const handleStatusChange = (newStatus: TTask['status']) => {
    task.status = newStatus;
    setMenuOpen(false);
  };

  //TODO change this to edit actual job star status
  const toggleStar = () => setStarred(!starred);

  return (
    <>
      <div className="relative">
        <div
          ref={ref}
          data-task-id={task.id}
          className={`grid grid-cols-[3fr_2fr_1fr_1fr_auto] items-center bg-white text-sm border-b last:rounded-b px-4 py-2 hover:bg-slate-100 hover:cursor-grab ${stateStyles[state.type] ??''}`}
        >
          <span className="flex items-center gap-2">
            <GripVertical size={10} />
            {task.content}
          </span>

          <span className="text-slate-700">{task.company}</span>

          <Badge variant={task.status.variant}> {task.status.title} </Badge>

          <button onClick={toggleStar} className="flex justify-center">
            {starred ? <Star className="text-amber-400 fill-amber-400" size={16} /> : <StarOff size={16} />}
          </button>

          <div className="relative flex justify-end">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              <MoreVertical size={18} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 z-10 w-28 bg-white border rounded shadow-md text-sm">
                <button onClick={() => handleStatusChange({title:'applied', variant:'applied'})} className="w-full text-left p-2 hover:bg-slate-100">Applied</button>
                <button onClick={() => handleStatusChange({title:'interview', variant:'interview'})} className="w-full text-left p-2 hover:bg-slate-100">Interview</button>
                <button onClick={() => handleStatusChange({title:'offer', variant:'offer'})} className="w-full text-left p-2 hover:bg-slate-100">Offer</button>
                <button onClick={() => handleStatusChange({title:'accepted', variant:'accepted'})} className="w-full text-left p-2 hover:bg-slate-100">Accepted</button>
                <button onClick={() => handleStatusChange({title:'closed', variant:'closed'})} className="w-full text-left p-2 hover:bg-slate-100">Closed</button>

              </div>
            )}
          </div>
        </div>

        {state.type === 'is-dragging-over' && state.closestEdge && (
          <DropIndicator edge={state.closestEdge} gap={'8px'} />
        )}
      </div>
      {state.type === 'preview'
        ? createPortal(<DragPreview task={task} />, state.container)
        : null}
    </>
  );
}

function DragPreview({ task }: { task: TTask }) {
  return <div className="border-solid rounded p-2 bg-white">{task.content}</div>;
}
