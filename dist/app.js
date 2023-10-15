import fs from 'fs';
import inquirer from 'inquirer';
export default async function App() {
    let todos = [];
    // Load existing todos from a JSON file
    function loadTodos() {
        try {
            const data = fs.readFileSync('./todos.json', 'utf-8');
            todos = JSON.parse(data);
        }
        catch (error) {
            todos = [];
        }
    }
    // Save todos to a JSON file
    function saveTodos() {
        fs.writeFileSync('./todos.json', JSON.stringify(todos));
    }
    // Function to create a new Todo item
    function createTodo() {
        inquirer
            .prompt([
            {
                type: 'input',
                name: 'task',
                message: 'Enter your task:',
            },
        ])
            .then((answers) => {
            const newTodo = {
                id: todos.length + 1,
                task: answers.task,
                completed: false,
            };
            todos.push(newTodo);
            saveTodos();
            console.log('Task added to your list.');
            displayTodos();
        });
    }
    // Function to mark a Todo item as completed
    function markComplete() {
        inquirer
            .prompt([
            {
                type: 'input',
                name: 'id',
                message: 'Enter the ID of the task you want to mark as completed:',
            },
        ])
            .then((answers) => {
            const id = parseInt(answers.id);
            const todo = todos.find((t) => t.id === id);
            if (todo) {
                todo.completed = true;
                saveTodos();
                console.log('Task marked as completed.');
            }
            else {
                console.log('Task not found.');
            }
            displayTodos();
        });
    }
    // Function to delete a Todo item
    function deleteTodo() {
        inquirer
            .prompt([
            {
                type: 'input',
                name: 'id',
                message: 'Enter the ID of the task you want to delete:',
            },
        ])
            .then((answers) => {
            const id = parseInt(answers.id);
            const index = todos.findIndex((todo) => todo.id === id);
            if (index !== -1) {
                todos.splice(index, 1);
                saveTodos();
                console.log('Task deleted.');
            }
            else {
                console.log('Task not found.');
            }
            displayTodos();
        });
    }
    // Function to display the list of Todos
    function displayTodos() {
        console.log('\nYour Todo List:');
        todos.forEach((todo) => {
            const status = todo.completed ? 'Completed' : 'Incomplete';
            console.log(`ID: ${todo.id} - Task: ${todo.task} - Status: ${status}`);
        });
        console.log();
    }
    console.log('Welcome to your Todo App!\n');
    let revisionStatus = true;
    // Entry point of the program
    loadTodos();
    inquirer
        .prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Choose an action:',
            choices: ['Create Todo', 'Mark Task as Completed', 'Delete Todo', 'Show Todos', 'Exit'],
        },
    ])
        .then((answers) => {
        if (answers.action === 'Create Todo') {
            createTodo();
        }
        else if (answers.action === 'Mark Task as Completed') {
            markComplete();
        }
        else if (answers.action === 'Delete Todo') {
            deleteTodo();
        }
        else if (answers.action === 'Show Todos') {
            displayTodos();
        }
        else {
            console.log('Goodbye!');
        }
    });
}
