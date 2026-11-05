
import fs from "node:fs";
import { argv } from "node:process";

const file_path = "./tasks.json";

const taskCompletionStatus = {
  pending: "pending",
  in_progress: "in-progress",
  complete: "complete",
};

function isValidTaskText(text) {
  return typeof text === "string" && text.trim().length > 0;
}

function parseTaskId(value) {
  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    return null;
  }

  const id = Number(value);

  if (
    Number.isNaN(id) ||
    !Number.isSafeInteger(id) ||
    id <= 0
  ) {
    return null;
  }

  return id;
}

function loadTasks() {
  try {
    if (!fs.existsSync(file_path)) {
      return [];
    }

    const data = fs.readFileSync(file_path, "utf-8");
    const tasks = JSON.parse(data);

    if (!Array.isArray(tasks)) {
      throw new Error("Invalid tasks.json: Expected an array");
    }

    return tasks;
  } catch (error) {
    console.error("Failed to load tasks:", error.message);
    throw error;
  }
}

function saveTasks(tasks) {
  fs.writeFileSync(
    file_path,
    JSON.stringify(tasks, null, 2),
    "utf-8"
  );
}

function addTask(text) {
  if (!isValidTaskText(text)) {
    console.log("Please provide a valid task description");
    return;
  }

  const tasks = loadTasks();

  const taskObj = {
    _id: Date.now(),
    task: text.trim(),
    status: taskCompletionStatus.pending,
  };

  // Avoid duplicate IDs
  while (tasks.some((task) => task._id === taskObj._id)) {
    taskObj._id++;
  }

  tasks.push(taskObj);
  saveTasks(tasks);

  console.log(`Task added successfully! ID: ${taskObj._id}`);
}

function listAllTask() {
  const tasks = loadTasks();

  if (tasks.length === 0) {
    console.log("No tasks found");
    return;
  }

  tasks.forEach((task) => {
    console.log(
      `${task._id} | ${task.task} | ${task.status}`
    );
  });
}

function updateTask(_id, text) {
  if (!isValidTaskText(text)) {
    console.log("Please provide a valid task description");
    return;
  }

  const tasks = loadTasks();

  const taskExists = tasks.some((task) => task._id === _id);

  if (!taskExists) {
    console.log("No task found");
    return;
  }

  const updatedTasks = tasks.map((task) =>
    task._id === _id
      ? { ...task, task: text.trim() }
      : task
  );

  saveTasks(updatedTasks);

  console.log("Task updated successfully");
}

function updateTaskStatus(_id, status) {
  if (!Object.values(taskCompletionStatus).includes(status)) {
    console.log(
      "Invalid status. Use: pending, in-progress, complete"
    );
    return;
  }

  const tasks = loadTasks();

  const taskExists = tasks.some((task) => task._id === _id);

  if (!taskExists) {
    console.log("No task found");
    return;
  }

  const updatedTasks = tasks.map((task) =>
    task._id === _id
      ? { ...task, status }
      : task
  );

  saveTasks(updatedTasks);

  console.log("Task status updated successfully");
}

function deleteTask(_id) {
  const tasks = loadTasks();

  const taskExists = tasks.some((task) => task._id === _id);

  if (!taskExists) {
    console.log("No task found");
    return;
  }

  const updatedTasks = tasks.filter(
    (task) => task._id !== _id
  );

  saveTasks(updatedTasks);

  console.log("Task removed successfully");
}

function filterTaskByStatus(status) {
  if (!Object.values(taskCompletionStatus).includes(status)) {
    console.log(
      "Invalid status. Use: pending, in-progress, complete"
    );
    return;
  }

  const tasks = loadTasks();

  const filteredTasks = tasks.filter(
    (task) => task.status === status
  );

  if (filteredTasks.length === 0) {
    console.log(`No tasks found with status: ${status}`);
    return;
  }

  filteredTasks.forEach((task) => {
    console.log(
      `${task._id} | ${task.task} | ${task.status}`
    );
  });
}

function showHelp() {
  console.log(`
📋 TODO CLI — Help Menu

Usage:
  node index.js <command> [arguments]

Commands:
  add <text>               Add a new task
  list                     List all tasks
  list <status>            Filter tasks by status
  update <id> <text>       Update task description
  mark <id> <status>       Update task status
  delete <id>              Delete a task
  help                     Show this help menu

Available Statuses:
  pending
  in-progress
  complete

Examples:
  node index.js add "Learn Node.js"
  node index.js list
  node index.js list pending
  node index.js update 12345 "Learn PostgreSQL"
  node index.js mark 12345 complete
  node index.js delete 12345
  node index.js help
`);
}

const command = argv[2];

try {
  switch (command) {
    case "add":
      if (argv.length !== 4) {
        console.log('Usage: node index.js add "Task description"');
        break;
      }

      addTask(argv[3]);
      break;

    case "list":
      if (argv.length > 4) {
        console.log("Usage: node index.js list [status]");
        break;
      }

      if (argv[3] !== undefined) {
        filterTaskByStatus(argv[3]);
      } else {
        listAllTask();
      }
      break;

    case "update": {
      const id = parseTaskId(argv[3]);

      if (id === null) {
        console.log("Invalid task ID");
        break;
      }

      if (argv.length !== 5) {
        console.log('Usage: node index.js update <id> "New text"');
        break;
      }

      updateTask(id, argv[4]);
      break;
    }

    case "mark": {
      const id = parseTaskId(argv[3]);

      if (id === null) {
        console.log("Invalid task ID");
        break;
      }

      if (argv.length !== 5) {
        console.log("Usage: node index.js mark <id> <status>");
        break;
      }

      updateTaskStatus(id, argv[4]);
      break;
    }

    case "delete": {
      const id = parseTaskId(argv[3]);

      if (id === null) {
        console.log("Invalid task ID");
        break;
      }

      if (argv.length !== 4) {
        console.log("Usage: node index.js delete <id>");
        break;
      }

      deleteTask(id);
      break;
    }

    case "help":
      showHelp();
      break;

    default:
      console.log(`Unknown command: ${command ?? "(none)"}`);
      console.log('Run "node index.js help" for available commands.');
      process.exitCode = 1;
  }
} catch (error) {
  console.error("Operation failed:", error.message);
  process.exitCode = 1;
}
