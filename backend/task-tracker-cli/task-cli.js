#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Ruta del archivo JSON
const tasksFilePath = path.join(__dirname, 'tasks.json');

// Crear el archivo JSON si no existe (inicializa con un arreglo vacío)
if (!fs.existsSync(tasksFilePath)) {
    fs.writeFileSync(tasksFilePath, JSON.stringify([]));
}

// Cargar tareas desde el archivo JSON (maneja archivo vacío o JSON inválido)
const loadTasks = () => {
    try {
        const data = fs.readFileSync(tasksFilePath, 'utf-8');

        // Si el archivo está vacío o tiene solo espacios/blancos, devolvemos un arreglo vacío
        if (!data.trim()) {
            return [];
        }

        // Intentamos parsear a JSON
        return JSON.parse(data);
    } catch (error) {
        // Si hay error en la lectura o el JSON está corrupto, retornamos un arreglo vacío
        return [];
    }
};

// Guardar tareas en el archivo JSON
const saveTasks = (tasks) => {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};

// Función principal
const main = () => {
    const [command, ...args] = process.argv.slice(2);

    const tasks = loadTasks();

    switch (command) {
        case 'add': {
            const description = args.join(' ');
            if (!description) {
                console.log('Error: Debes proporcionar una descripción para la tarea.');
                break;
            }

            const newTask = {
                id: tasks.length + 1,
                description,
                status: 'todo',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            tasks.push(newTask);
            saveTasks(tasks);
            console.log(`Tarea añadida con éxito (ID: ${newTask.id})`);
            break;
        }

        case 'update': {
            const [id, ...desc] = args;
            const description = desc.join(' ');
            const taskId = parseInt(id, 10);

            if (isNaN(taskId)) {
                console.log('Error: Debes proporcionar un ID de tarea válido.');
                break;
            }

            const task = tasks.find((t) => t.id === taskId);
            if (!task) {
                console.log(`Error: No se encontró la tarea con ID ${id}.`);
                break;
            }
            if (!description) {
                console.log('Error: Debes proporcionar una nueva descripción.');
                break;
            }

            task.description = description;
            task.updatedAt = new Date().toISOString();
            saveTasks(tasks);
            console.log(`Tarea ${id} actualizada con éxito.`);
            break;
        }

        case 'delete': {
            const id = parseInt(args[0], 10);
            if (isNaN(id)) {
                console.log('Error: Debes proporcionar un ID de tarea válido.');
                break;
            }

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
            const id = parseInt(args[0], 10);
            if (isNaN(id)) {
                console.log('Error: Debes proporcionar un ID de tarea válido.');
                break;
            }

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
            const id = parseInt(args[0], 10);
            if (isNaN(id)) {
                console.log('Error: Debes proporcionar un ID de tarea válido.');
                break;
            }

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
            const status = args[0];
            let filteredTasks = tasks;

            if (status) {
                filteredTasks = tasks.filter((t) => t.status === status);
            }

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
