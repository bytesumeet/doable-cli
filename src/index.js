import fs from "node:fs";
const file_path = "./tasks.json";

function loadTasks() {
  if (!fs.existsSync(file_path)) return [];
  try {
    const data = fs.readFileSync(file_path, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to load task: ", error.message);
  }
}

function addTask(text) {
  const tasks = loadTasks();
  console.log(tasks);
  const taskObj = {
    _id: Date.now(),
    task: text,
    status: "pending",
  };
  tasks.push(taskObj);
  fs.writeFileSync(file_path, JSON.stringify(tasks));
  console.log("Task added successfully");
}

function listAllTask() {
  const tasks = loadTasks();
  if (!loadTasks()) {
    console.log("No tasks found");
    return;
  }
  tasks.map((task) => {
    console.log(`${task._id} | ${task.text} | ${task.status}`);
  });
}

