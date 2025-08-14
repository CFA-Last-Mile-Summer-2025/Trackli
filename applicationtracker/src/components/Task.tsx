import { GripVertical, MoreVertical, Star, StarOff } from "lucide-react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { type HTMLAttributes, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { createPortal } from "react-dom";
import {
  attachClosestEdge,
  type Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import { getTaskData, isTaskData, type TTask } from "./Task-data";
import { Badge } from "./ui/badge";
import { fetchWithAuth } from "@/utils/tokenChecker";

type TaskState =
  | { type: "idle" }
  | { type: "preview"; container: HTMLElement }
  | { type: "is-dragging" }
  | { type: "is-dragging-over"; closestEdge: Edge | null };

const stateStyles: {
  [Key in TaskState["type"]]?: HTMLAttributes<HTMLDivElement>["className"];
} = {
  "is-dragging": "opacity-40",
};

const idle: TaskState = { type: "idle" };

interface TaskProps {
  task: TTask;
  onRefresh?: () => void;
  isLastItems?: boolean;
}

export function Task({ task, onRefresh, isLastItems = false }: TaskProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<TaskState>(idle);
  const [menuOpen, setMenuOpen] = useState(false);
  const [starred, setStarred] = useState(task.starred ?? false);
  const [currentStatus, setCurrentStatus] = useState(task.status);
  const [isUpdating, setIsUpdating] = useState(false);

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
            getOffset: pointerOutsideOfPreview({ x: "16px", y: "8px" }),
            render({ container }) {
              setState({ type: "preview", container });
            },
          });
        },
        onDragStart() {
          setState({ type: "is-dragging" });
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
            allowedEdges: ["top", "bottom"],
          });
        },
        getIsSticky: () => true,
        onDragEnter({ self }) {
          setState({
            type: "is-dragging-over",
            closestEdge: extractClosestEdge(self.data),
          });
        },
        onDrag({ self }) {
          const closestEdge = extractClosestEdge(self.data);
          setState((current) =>
            current.type === "is-dragging-over" &&
            current.closestEdge === closestEdge
              ? current
              : { type: "is-dragging-over", closestEdge }
          );
        },
        onDragLeave: () => setState(idle),
        onDrop: () => setState(idle),
      })
    );
  }, [task]);

  const handleStatusChange = async (newStatus: TTask["status"]) => {
    try {
      setIsUpdating(true);
      // Immediately update UI for instant feedback
      setCurrentStatus(newStatus);
      setMenuOpen(false);
      
      const res = await fetchWithAuth(`http://localhost:3002/myjob/status/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus.title }),
      });

      if (res.ok) {
        // Update the original task object
        task.status = newStatus;
        // Refresh the task list to get updated data from server
        if (onRefresh) {
          await onRefresh();
        }
      } else {
        // Revert UI change if server update failed
        setCurrentStatus(task.status);
        const { message } = await res.json();
        console.error("Status update failed:", message);
      }
    } catch (error) {
      // Revert UI change if request failed
      setCurrentStatus(task.status);
      console.error("Error updating job status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleStar = async (task: TTask) => {
    try {
      const isCurrentlyStarred = task.starred;

      if (isCurrentlyStarred) {
        const favorites = await fetchWithAuth(
          "http://localhost:3002/favorite",
          {
            method: "GET",
          }
        ).then((res) => res.json());
        const favorite = favorites.find((fav: any) => fav.url === task.url);

        await fetchWithAuth(`http://localhost:3002/favorite/${favorite._id}`, {
          method: "DELETE",
        });
      } else {
        // Add to favorites
        await fetchWithAuth("http://localhost:3002/addFavorite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company: task.company.replace(/^@\s*/, ""),
            title: task.content,
            skills: task.skills || "",
            job_type: task.job_type || "N/A",
            url: task.url,
          }),
        });
      }

      setStarred(!isCurrentlyStarred);
      task.starred = !isCurrentlyStarred;
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuOpen && !ref.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <>
      <div className="relative">
        <div
          ref={ref}
          data-task-id={task.id}
          className={`grid grid-cols-[3fr_2fr_1fr_1fr_auto] items-center bg-white text-sm border-b border-white/5 last:border-b-0 px-6 py-4 hover:bg-black/20 hover:cursor-grab transition-colors duration-200 ${
            stateStyles[state.type] ?? ""
          }`}
        >
          <span className="flex items-center gap-2">
            <GripVertical size={12} className="" />
            <span className="">{task.content}</span>
          </span>

          <span className="">{task.company}</span>

          <Badge variant={currentStatus.variant} className={isUpdating ? "opacity-50" : ""}>
            {currentStatus.title}
          </Badge>

          <button
            onClick={() => toggleStar(task)}
            className="flex justify-center hover:scale-110 transition-transform duration-200"
          >
            {starred ? (
              <Star className="text-amber-400 fill-amber-400" size={16} />
            ) : (
              <StarOff size={16} className="hover:text-white/80" />
            )}
          </button>

          <div className="relative flex justify-end">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 hover:bg-white/10 rounded transition-colors duration-200"
            >
              <MoreVertical size={18} className="" />
            </button>
            {menuOpen && (
              <div 
                className={`absolute right-0 z-[9999] w-36 backdrop-blur-xl bg-gray-900/95 border border-gray-600/50 rounded-xl shadow-2xl text-sm overflow-hidden ${
                  isLastItems ? 'bottom-full mb-2' : 'top-full mt-2'
                }`}
                style={{ zIndex: 9999 }}
              >
                <div className="py-1">
                  <button
                    onClick={() =>
                      handleStatusChange({ title: "applied", variant: "applied" })
                    }
                    disabled={isUpdating}
                    className="w-full text-left px-4 py-3 hover:bg-gray-700/50 text-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Applied
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange({
                        title: "interview",
                        variant: "interview",
                      })
                    }
                    disabled={isUpdating}
                    className="w-full text-left px-4 py-3 hover:bg-gray-700/50 text-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Interview
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange({ title: "offer", variant: "offer" })
                    }
                    disabled={isUpdating}
                    className="w-full text-left px-4 py-3 hover:bg-gray-700/50 text-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Offer
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange({
                        title: "accepted",
                        variant: "accepted",
                      })
                    }
                    disabled={isUpdating}
                    className="w-full text-left px-4 py-3 hover:bg-gray-700/50 text-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Accepted
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange({ title: "closed", variant: "closed" })
                    }
                    disabled={isUpdating}
                    className="w-full text-left px-4 py-3 hover:bg-gray-700/50 text-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Closed
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {state.type === "is-dragging-over" && state.closestEdge && (
          <DropIndicator edge={state.closestEdge} gap={"8px"} />
        )}
      </div>
      {state.type === "preview"
        ? createPortal(<DragPreview task={task} />, state.container)
        : null}
    </>
  );
}

function DragPreview({ task }: { task: TTask }) {
  return (
    <div className="border border-white/20 rounded-lg p-3 backdrop-blur-md bg-black/80 text-white shadow-xl">
      {task.content}
    </div>
  );
}