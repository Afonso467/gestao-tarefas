const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

let tasks = [];

// Adicionar Tarefa
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const task = { id: Date.now(), text: taskText, completed: false };
        tasks.push(task);
        renderTasks();
        taskInput.value = '';
    }
});

// Renderizar Tarefas
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-actions">
                <button class="edit" onclick="editTask(${task.id})">Editar</button>
                <button class="delete" onclick="deleteTask(${task.id})">Excluir</button>
            </div>
        `;
        li.addEventListener('click', () => toggleTask(task.id));
        taskList.appendChild(li);
    });
}

// Alternar Status
function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    renderTasks();
}

// Editar Tarefa
function editTask(id) {
    const task = tasks.find(task => task.id === id);
    const newText = prompt('Editar tarefa:', task.text);
    if (newText) {
        task.text = newText.trim();
        renderTasks();
    }
}

// Excluir Tarefa
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}

renderTasks();