[task-tracker](https://roadmap.sh/projects/task-tracker)
---

# Task Tracker CLI

A simple command-line tool to manage and track tasks. It allows you to add, update, delete, and list your tasks, as well as mark tasks as in-progress or done. All tasks are stored in a local JSON file.

## Prerequisites

- **Node.js** (version 12 or above is recommended).
- A terminal or command prompt to run the CLI commands.

## Installation

1. Clone or download this repository.
2. Open a terminal in the project directory and run:
```
npm init -y
```
This step initializes your Node.js project (optional if you already have a `package.json`).

3. (Linux/Mac only) Make the script executable (this allows `./task-cli.js`):
```
chmod +x task-cli.js
```
4. By default, the script creates a `tasks.json` file if it doesn't exist.

## Usage

### Add a Task

    node task-cli.js add "Your task description"

Creates a new task with a unique ID and sets its status to `todo`.

### Update a Task

    node task-cli.js update <id> "New description"

Updates the description of the task with the specified ID.

### Delete a Task

    node task-cli.js delete <id>

Removes the task with the specified ID from the list.

### Mark a Task as In-Progress

    node task-cli.js mark-in-progress <id>

Changes the status of the task with the specified ID to `in-progress`.

### Mark a Task as Done

    node task-cli.js mark-done <id>

Changes the status of the task with the specified ID to `done`.

### List Tasks

    node task-cli.js list

Lists **all** tasks stored in `tasks.json`.

You can also filter by status:

    node task-cli.js list todo
    node task-cli.js list in-progress
    node task-cli.js list done

Lists only tasks matching the given status.

## Examples

1. **Add and List Tasks**

       node task-cli.js add "Buy groceries"
       # Output: Tarea añadida con éxito (ID: 1)

       node task-cli.js add "Write project documentation"
       # Output: Tarea añadida con éxito (ID: 2)

       node task-cli.js list
       # Output:
       # 2 tareas encontradas:
       # [TODO] ID: 1, Descripción: "Buy groceries", Creada: 2025-01-20T15:00:00.000Z
       # [TODO] ID: 2, Descripción: "Write project documentation", Creada: 2025-01-20T15:05:00.000Z

2. **Update a Task**

       node task-cli.js update 1 "Buy groceries and cook dinner"
       # Output: Tarea 1 actualizada con éxito.

3. **Mark a Task as In-Progress**

       node task-cli.js mark-in-progress 1
       # Output: Tarea 1 marcada como "en progreso".

4. **Mark a Task as Done**

       node task-cli.js mark-done 1
       # Output: Tarea 1 marcada como "completada".

5. **Delete a Task**

       node task-cli.js delete 2
       # Output: Tarea 2 eliminada con éxito.
