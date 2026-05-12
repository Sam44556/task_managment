/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { X, Edit, Eye, Plus, Search, Calendar, Flag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTasks,
  addTask,
  updateTask,
  removeTask,
} from "../redux/features/task/taskSlice";
import { logout } from "../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import ClipLoader from "react-spinners/ClipLoader";

const TaskDetailModal = ({ task, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
        <h2 className="text-2xl font-bold text-white">Task Details</h2>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Title</label>
          <p className="text-lg font-medium text-gray-900 mt-1">{task.title}</p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Description</label>
          <p className="text-gray-700 mt-1">{task.description || "No description"}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Status</label>
            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
              task.status === "Done" ? "bg-green-100 text-green-800" :
              task.status === "In Progress" ? "bg-blue-100 text-blue-800" :
              "bg-gray-100 text-gray-800"
            }`}>
              {task.status}
            </span>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Priority</label>
            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
              task.priority === "High" ? "bg-red-100 text-red-800" :
              task.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
              "bg-green-100 text-green-800"
            }`}>
              {task.priority}
            </span>
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
            <Calendar size={16} /> Due Date
          </label>
          <p className="text-gray-700 mt-1">
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}
          </p>
        </div>
      </div>
      <div className="p-6 bg-gray-50 rounded-b-2xl">
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

const EditTaskModal = ({ task, onSave, onClose }) => {
  const [editedTask, setEditedTask] = useState(task);

  const handleSave = () => {
    onSave(editedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Edit Task</h2>
        </div>
        <div className="p-6 space-y-4">
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) =>
              setEditedTask({ ...editedTask, title: e.target.value })
            }
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
            placeholder="Task Title"
          />
          <textarea
            value={editedTask.description}
            onChange={(e) =>
              setEditedTask({ ...editedTask, description: e.target.value })
            }
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
            rows="3"
            placeholder="Task Description"
          />
          <select
            value={editedTask.status}
            onChange={(e) =>
              setEditedTask({ ...editedTask, status: e.target.value })
            }
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <select
            value={editedTask.priority}
            onChange={(e) =>
              setEditedTask({ ...editedTask, priority: e.target.value })
            }
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            type="date"
            value={editedTask.dueDate ? editedTask.dueDate.split("T")[0] : ""}
            onChange={(e) =>
              setEditedTask({ ...editedTask, dueDate: e.target.value })
            }
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>
        <div className="p-6 bg-gray-50 rounded-b-2xl flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const AddTaskModal = ({ onSave, onClose }) => {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    dueDate: "",
  });

  const handleSave = () => {
    if (!newTask.title.trim()) {
      alert("Please enter a task title");
      return;
    }
    onSave(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Create New Task</h2>
        </div>
        <div className="p-6 space-y-4">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) =>
              setNewTask({ ...newTask, title: e.target.value })
            }
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
            placeholder="Task Title *"
          />
          <textarea
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
            rows="3"
            placeholder="Task Description"
          />
          <select
            value={newTask.status}
            onChange={(e) =>
              setNewTask({ ...newTask, status: e.target.value })
            }
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <select
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({ ...newTask, priority: e.target.value })
            }
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) =>
              setNewTask({ ...newTask, dueDate: e.target.value })
            }
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
          />
        </div>
        <div className="p-6 bg-gray-50 rounded-b-2xl flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-105"
          >
            Add Task
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const TrelloBoard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [viewTask, setViewTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector((state) => state.tasks.tasks);
  let color = "#ffffff";

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "#3498db",
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/api/v1/tasks");
        dispatch(setTasks(response.data));
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          dispatch(logout());
          navigate("/login");
        } else {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchTasks();
  }, [dispatch, navigate]);

  const columns = {
    todo: {
      id: "todo",
      title: "TODO",
      tasks: tasks.filter((task) => task.status === "To Do"),
    },
    inProgress: {
      id: "inProgress",
      title: "IN PROGRESS",
      tasks: tasks.filter((task) => task.status === "In Progress"),
    },
    done: {
      id: "done",
      title: "DONE",
      tasks: tasks.filter((task) => task.status === "Done"),
    },
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const task = columns[source.droppableId].tasks[source.index];
    const updatedTask = {
      ...task,
      status:
        destination.droppableId === "inProgress"
          ? "In Progress"
          : destination.droppableId === "done"
          ? "Done"
          : "To Do",
    };

    try {
      const response = await axios.put(
        `/api/v1/tasks/${task._id}`,
        updatedTask
      );
      dispatch(updateTask(response.data));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        dispatch(logout());
        navigate("/login");
      } else {
        setError(err.message);
      }
    }
  };

  const addNewTask = async (taskData) => {
    try {
      const response = await axios.post("/api/v1/tasks", taskData);
      dispatch(addTask(response.data));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        dispatch(logout());
        navigate("/login");
      } else {
        setError(err.message);
      }
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/v1/tasks/${taskId}`);
      dispatch(removeTask(taskId));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        dispatch(logout());
        navigate("/login");
      } else {
        setError(err.message);
      }
    }
  };

  const handleEditTask = async (updatedTask) => {
    try {
      const response = await axios.put(
        `/api/v1/tasks/${updatedTask._id}`,
        updatedTask
      );
      dispatch(updateTask(response.data));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        dispatch(logout());
        navigate("/login");
      } else {
        setError(err.message);
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <ClipLoader
          color="#3498db"
          loading={loading}
          cssOverride={override}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl">
        Error: {error}
      </div>
    </div>
  );

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredColumns = {
    todo: {
      ...columns.todo,
      tasks: filteredTasks.filter((task) => task.status === "To Do"),
    },
    inProgress: {
      ...columns.inProgress,
      tasks: filteredTasks.filter((task) => task.status === "In Progress"),
    },
    done: {
      ...columns.done,
      tasks: filteredTasks.filter((task) => task.status === "Done"),
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      {/* Header Section */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Task Board
              </h1>
              <p className="text-gray-600 mt-1">Manage your tasks efficiently</p>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg"
                onClick={() => setShowAddModal(true)}
              >
                <Plus size={20} />
                Add Task
              </button>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Board Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(filteredColumns).map((column) => (
              <div key={column.id} className="flex flex-col">
                {/* Column Header */}
                <div className={`rounded-t-2xl p-4 shadow-md ${
                  column.id === "todo" ? "bg-gradient-to-r from-gray-600 to-gray-700" :
                  column.id === "inProgress" ? "bg-gradient-to-r from-blue-600 to-blue-700" :
                  "bg-gradient-to-r from-green-600 to-green-700"
                }`}>
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-white text-lg">{column.title}</h2>
                    <span className="bg-white bg-opacity-30 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {column.tasks.length}
                    </span>
                  </div>
                </div>

                {/* Column Content */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 p-4 rounded-b-2xl min-h-[500px] transition-colors ${
                        snapshot.isDraggingOver ? "bg-blue-50" : "bg-white"
                      } shadow-md`}
                    >
                      <div className="space-y-3">
                        {column.tasks.map((task, index) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white border-2 border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-lg transition-all transform ${
                                  snapshot.isDragging ? "rotate-2 scale-105 shadow-2xl" : ""
                                }`}
                              >
                                {/* Priority Badge */}
                                <div className="flex items-center justify-between mb-2">
                                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                                    task.priority === "High" ? "bg-red-100 text-red-700" :
                                    task.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                                    "bg-green-100 text-green-700"
                                  }`}>
                                    <Flag size={12} />
                                    {task.priority}
                                  </span>
                                </div>

                                {/* Task Title */}
                                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                                  {task.title}
                                </h3>

                                {/* Task Description */}
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                  {task.description || "No description"}
                                </p>

                                {/* Due Date */}
                                {task.dueDate && (
                                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                    <Calendar size={14} />
                                    {new Date(task.dueDate).toLocaleDateString()}
                                  </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                                  <button
                                    onClick={() => setViewTask(task)}
                                    className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-semibold"
                                    title="View Details"
                                  >
                                    <Eye size={18} />
                                  </button>
                                  <button
                                    onClick={() => setEditTask(task)}
                                    className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-semibold"
                                    title="Edit Task"
                                  >
                                    <Edit size={18} />
                                  </button>
                                  <button
                                    onClick={() => deleteTask(task._id)}
                                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-semibold"
                                    title="Delete Task"
                                  >
                                    <X size={18} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                      
                      {/* Empty State */}
                      {column.tasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                          <div className="text-6xl mb-4">📋</div>
                          <p className="text-sm font-medium">No tasks yet</p>
                          <p className="text-xs">Drag tasks here or create a new one</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Modals */}
      {viewTask && (
        <TaskDetailModal task={viewTask} onClose={() => setViewTask(null)} />
      )}
      {editTask && (
        <EditTaskModal
          task={editTask}
          onSave={handleEditTask}
          onClose={() => setEditTask(null)}
        />
      )}
      {showAddModal && (
        <AddTaskModal
          onSave={addNewTask}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default TrelloBoard;
