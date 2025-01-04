document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const searchInput = document.getElementById('search-task');
    const completeAllBtn = document.getElementById('complete-all-btn');
    const deleteAllBtn = document.getElementById('delete-all-btn');
    const sortTasksSelect = document.getElementById('sort-tasks');

    let tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];

    // Adicionar Tarefa
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        const taskCategory = document.getElementById('task-category').value;
        const taskPriority = document.getElementById('task-priority').value;
        const taskDueDate = document.getElementById('task-due-date').value;

        if (taskText) {
            const task = { 
                id: Date.now(), 
                text: taskText, 
                category: taskCategory, 
                priority: taskPriority, 
                dueDate: taskDueDate || 'Sem data', 
                completed: false 
            };
            tasks.push(task);
            saveTasks();
            renderTasks();
            taskInput.value = '';
        } else {
            alert('Por favor, insira uma tarefa válida.');
        }
    });

    // Renderizar Tarefas
    function renderTasks(query = '') {
        taskList.innerHTML = '';
        tasks
            .filter(task => task.text.toLowerCase().includes(query.toLowerCase()))
            .forEach(task => {
                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''} ${isTaskOverdue(task) ? 'overdue' : ''}`;
                li.innerHTML = `
                    <span>${task.text} 
                        <small>(${task.category} - ${task.priority} - ${task.dueDate})</small>
                    </span>
                    <div class="task-actions">
                        <button class="edit" onclick="editTask(${task.id})">Editar</button>
                        <button class="delete" onclick="deleteTask(${task.id})">Excluir</button>
                    </div>
                `;
                li.addEventListener('click', () => toggleTask(task.id));
                taskList.appendChild(li);
            });
    }

    // Função para verificar tarefas atrasadas
    function isTaskOverdue(task) {
        if (task.dueDate && !task.completed) {
            const today = new Date().toISOString().split('T')[0];
            return task.dueDate < today;
        }
        return false;
    }

    // Alternar Status
    function toggleTask(id) {
        tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
        saveTasks();
        renderTasks();
    }

    // Marcar Todas como Concluídas
    completeAllBtn.addEventListener('click', () => {
        tasks = tasks.map(task => ({ ...task, completed: true }));
        saveTasks();
        renderTasks();
    });

    // Excluir Todas as Tarefas
    deleteAllBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja excluir todas as tarefas?')) {
            tasks = [];
            saveTasks();
            renderTasks();
        }
    });

    // Ordenar Tarefas
    sortTasksSelect.addEventListener('change', () => {
        const sortType = sortTasksSelect.value;
        if (sortType === 'priority') {
            tasks.sort((a, b) => a.priority.localeCompare(b.priority));
        } else if (sortType === 'dueDate') {
            tasks.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
        }
        renderTasks();
    });

    // Editar Tarefa
    window.editTask = function (id) {
        const task = tasks.find(task => task.id === id);
        const newText = prompt('Editar tarefa:', task.text);
        if (newText) {
            task.text = newText.trim();
            saveTasks();
            renderTasks();
        }
    };

    // Excluir Tarefa
    window.deleteTask = function (id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    };

    // Salvar Tarefas no sessionStorage
    function saveTasks() {
        sessionStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Buscar Tarefas
    searchInput.addEventListener('input', () => {
        const query = searchInput.value;
        renderTasks(query);
    });

    // Inicializar
    renderTasks();
});
