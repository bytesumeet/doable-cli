import fs from "node:fs";
import { argv } from "node:process";
const file_path = "./tasks.json";

const taskCompletionStatus = {
  pending: "pending",
  in_progress: "in-progress",
  complete: "complete",
};

function loadTasks() {
  if (!fs.existsSync(file_path)) return [];
  try {
    const data = fs.readFileSync(file_path, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to load task: ", error.message);
    throw error;
  }
}

function addTask(text) {
  const tasks = loadTasks();
  console.log(tasks);
  const taskObj = {
    _id: Date.now(),
    task: text,
    status: taskCompletionStatus.pending,
  };
  tasks.push(taskObj);
  fs.writeFileSync(file_path, JSON.stringify(tasks, null, 2));
  console.log("Task added successfully");
}

function listAllTask() {
  const tasks = loadTasks();
  if (tasks.length === 0) {
    console.log("No tasks found");
    return;
  }
  tasks.forEach((task) => {
    console.log(`${task._id} | ${task.task} | ${task.status}`);
  });
}

function updateTask(_id, text, status) {
  const tasks = loadTasks();
  const taskExists = tasks.some((task) => task._id === _id);
  if (!taskExists) {
    console.log("No task found");
    return;
  }
  if (text === undefined && status === undefined) {
    console.log("Provide text or status to update");
    return;
  }
  if (status !== undefined && !Object.values(taskCompletionStatus).includes(status)) {
    console.log("Invalid status");
    return;
  }
  const updatedTasks = tasks.map((task) =>
    task._id === _id
      ? {
          ...task,
          ...(text !== undefined && { task: text }),
          ...(status !== undefined && { status }),
        }
      : task,
  );

  fs.writeFileSync(file_path, JSON.stringify(updatedTasks, null, 2));
  console.log("Task updated successfully");
}

function deleteTask(_id) {
  const tasks = loadTasks();
  const taskExist = tasks.find((t) => t._id === _id);
  if (!taskExist) {
    console.log("No task found");
    return;
  }
  const updateTaskList = tasks.filter((t) => t._id !== _id);
  fs.writeFileSync(file_path, JSON.stringify(updateTaskList, null, 2));
  console.log("Task removed successfully");
}

function filterTaskByStatus(status) {
  const tasks = loadTasks();
  if (!Object.values(taskCompletionStatus).includes(status)) {
    console.log("Please enter a valid status");
    return;
  }
  const filteredTask = tasks.filter((t) => status === t.status);
  filteredTask.map((task) => {
    console.log(`${task._id} | ${task.text} | ${task.status}`);
  });
}

const argv = process.argv;

switch (argv[2]) {
  case "add":
    addTask(argv[3]);
    break;

  case "list":
    if (argv[3]) {
      filterTaskByStatus(argv[3]);
    } else {
      listAllTask();
    }
    break;

  case "update":
    updateTask(Number(argv[3]), argv[4], argv[5]);
    break;

  case "delete":
    deleteTask(Number(argv[3]));
    break;

  default:
    console.log("Invalid command");
}
