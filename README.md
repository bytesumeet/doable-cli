# Todo CLI

A simple, dependency-free command-line task manager built with **Node.js**. Tasks are stored locally in a JSON file, and you can add, list, update, mark, filter, and delete them from your terminal.

## Features

- Add tasks with a default `pending` status
- List all tasks or filter by status
- Update a task's description
- Mark tasks as `pending`, `in-progress`, or `complete`
- Delete tasks by ID
- Validate task descriptions, IDs, and status values
- Persist tasks to `tasks.json` using Node.js's synchronous filesystem API

## Requirements

- Node.js with support for ECMAScript modules (Node.js 18+ recommended)
- No external dependencies

## Getting started

1. Clone or download the project and open its directory in your terminal.
2. Save the CLI code as `index.js`.
3. Enable ES modules by adding a `package.json` file:

   ```json
   {
     "name": "todo-cli",
     "version": "1.0.0",
     "private": true,
     "type": "module"
   }
   ```

4. Try the help command:

   ```bash
   node index.js help
   ```

> `tasks.json` is created automatically when you add your first task. With the current `./tasks.json` path, run commands from the project directory so they use the same data file.

## Commands

| Command              | Description               | Example                                         |
| -------------------- | ------------------------- | ----------------------------------------------- |
| `add <text>`         | Add a new task            | `node index.js add "Learn Node.js"`             |
| `list`               | List all tasks            | `node index.js list`                            |
| `list <status>`      | Filter tasks by status    | `node index.js list pending`                    |
| `update <id> <text>` | Update a task description | `node index.js update 12345 "Learn PostgreSQL"` |
| `mark <id> <status>` | Change a task's status    | `node index.js mark 12345 in-progress`          |
| `delete <id>`        | Delete a task             | `node index.js delete 12345`                    |
| `help`               | Show command help         | `node index.js help`                            |

**Available statuses:** `pending`, `in-progress`, `complete`.

### Example workflow

```bash
# Create a task; copy the ID printed by the CLI
node index.js add "Learn Node.js"

# See all saved tasks and their IDs
node index.js list

# Replace <id> with the numeric ID shown above
node index.js update <id> "Learn Node.js filesystem"
node index.js mark <id> in-progress
node index.js list in-progress
node index.js mark <id> complete
node index.js delete <id>
```

## Data format

Tasks are stored as an array of objects inside `tasks.json`:

```json
[
  {
    "_id": 1793900000000,
    "task": "Learn Node.js",
    "status": "pending"
  }
]
```

The ID above is illustrative. New IDs are generated from `Date.now()`; the implementation also checks for duplicate IDs already in the file.

## How it works

1. `process.argv` provides the command and arguments.
2. The CLI validates task text, numeric IDs, and allowed statuses.
3. `loadTasks()` reads and parses `tasks.json` (or returns an empty array if the file does not exist).
4. Array methods such as `push()`, `map()`, `filter()`, and `some()` perform operations.
5. `saveTasks()` writes the updated array back to `tasks.json`.

## Project structure

```text
todo-cli/
├── src/
│   └── index.js     # Commands and task operations
|   └── tasks.json   # Created after adding a task
├── package.json     # Enables ES modules
└── README.json        # Project documentation
```

## Limitations and future improvements

- This version uses **synchronous** file operations (`node:fs`). An asynchronous version using `node:fs/promises` is a natural next step.
- The current JSON file path is relative to the terminal's working directory.
- Concurrent CLI processes may overwrite each other's changes. JSON file writes are not atomic.
- This project does not have automated tests yet; `node:test` would be a good addition.
- A future `bin` entry and executable shebang could make the tool runnable as `todo` instead of `node index.js`.

## Built with

- JavaScript (ES modules)
- Node.js built-in modules: `node:fs` and `node:process`

## License

No license has been specified yet.
