#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Ruta del archivo JSON
const tasksFilePath = path.join(__dirname, 'tasks.json');

// Crear el archivo JSON si no existe
if (!fs.existsSync(tasksFilePath)) {
    fs.writeFileSync(tasksFilePath, JSON.stringify([]));
}

// Función para cargar tareas desde el archivo JSON
const loadTasks = () => {
    const data = fs.readFileSync(tasksFilePath, 'utf-8');
    return JSON.parse(data);
};

// Función para guardar tareas en el archivo JSON
const saveTasks = (tasks) => {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};

// Función principal
const main = () => {
    const [command, ...args] = process.argv.slice(2);

    // Cargamos las tareas
    const tasks = loadTasks();

    switch (command) {
        case 'add': {
            // 1. Tomamos la descripción de los args
            const description = args.join(' ');
            if (!description) {
                console.log('Error: Debes proporcionar una descripción para la tarea.');
                break;
            }

            // 2. Creamos la nueva tarea
            const newTask = {
                id: tasks.length + 1,
                description,
                status: 'todo',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            // 3. Guardamos la tarea en el array y en el archivo
            tasks.push(newTask);
            saveTasks(tasks);

            console.log(`Tarea añadida con éxito (ID: ${newTask.id})`);
            break;
        }

        case 'update': {
            // 1. Tomamos el id y la nueva descripción
            const [id, ...desc] = args;
            const description = desc.join(' ');

            const taskId = parseInt(id, 10);
            if (isNaN(taskId)) {
                console.log('Error: Debes proporcionar un ID de tarea válido.');
                break;
            }

            // 2. Buscamos la tarea
            const task = tasks.find((t) => t.id === taskId);
            if (!task) {
                console.log(`Error: No se encontró la tarea con ID ${id}.`);
                break;
            }
            if (!description) {
                console.log('Error: Debes proporcionar una nueva descripción.');
                break;
            }

            // 3. Actualizamos
            task.description = description;
            task.updatedAt = new Date().toISOString();
            saveTasks(tasks);

            console.log(`Tarea ${id} actualizada con éxito.`);
            break;
        }

        case 'delete': {
            // 1. Obtenemos el ID
            const id = parseInt(args[0], 10);
            if (isNaN(id)) {
                console.log('Error: Debes proporcionar un ID de tarea válido.');
                break;
            }

            // 2. Buscamos y eliminamos
            const index = tasks.findIndex((t) => t.id === id);
            if (index === -1) {
                console.log(`Error: No se encontró la tarea con ID ${id}.`);
                break;
            }
            tasks.splice(index, 1);
            saveTasks(tasks);

            console.log(`Tarea ${id} eliminada con éxito.`);
            break;
        }

        case 'mark-in-progress': {
            // 1. Obtenemos el ID
            const id = parseInt(args[0], 10);
            if (isNaN(id)) {
                console.log('Error: Debes proporcionar un ID de tarea válido.');
                break;
            }

            // 2. Localizamos la tarea y cambiamos el estado
            const task = tasks.find((t) => t.id === id);
            if (!task) {
                console.log(`Error: No se encontró la tarea con ID ${id}.`);
                break;
            }

            task.status = 'in-progress';
            task.updatedAt = new Date().toISOString();
            saveTasks(tasks);

            console.log(`Tarea ${id} marcada como "en progreso".`);
            break;
        }

        case 'mark-done': {
            // 1. Obtenemos el ID
            const id = parseInt(args[0], 10);
            if (isNaN(id)) {
                console.log('Error: Debes proporcionar un ID de tarea válido.');
                break;
            }

            // 2. Localizamos la tarea y cambiamos el estado
            const task = tasks.find((t) => t.id === id);
            if (!task) {
                console.log(`Error: No se encontró la tarea con ID ${id}.`);
                break;
            }

            task.status = 'done';
            task.updatedAt = new Date().toISOString();
            saveTasks(tasks);

            console.log(`Tarea ${id} marcada como "completada".`);
            break;
        }

        case 'list': {
            // 1. Verificamos si se pasó un estado
            const status = args[0];
            let filteredTasks = tasks;

            // 2. Si se pasa "done", "todo", etc., filtramos
            if (status) {
                filteredTasks = tasks.filter((t) => t.status === status);
            }

            // 3. Mostramos la lista
            console.log(`\n${filteredTasks.length} tareas encontradas:`);
            filteredTasks.forEach((task) => {
                console.log(
                    `[${task.status.toUpperCase()}] ID: ${task.id}, Descripción: "${task.description}", Creada: ${task.createdAt}`
                );
            });
            break;
        }

        default: {
            console.log('Comando no reconocido. Usa uno de los siguientes:');
            console.log('add <descripcion>, update <id> <descripcion>, delete <id>');
            console.log('mark-in-progress <id>, mark-done <id>, list [status]');
            break;
        }
    }
};

main();
