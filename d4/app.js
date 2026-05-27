let tasks = [];
let currentFilter = 'all';

const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const itemsLeft = document.getElementById('items-left');
const filterGroup = document.getElementById('filter-group');

function render() {
    taskList.replaceChildren();

    const filteredTasks = tasks.filter(t => {
        if (currentFilter === 'active') return !t.completed;
        if (currentFilter === 'completed') return t.completed;
        return true;
    });

    const fragment = document.createDocumentFragment();

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text; 

        const btn = document.createElement('button');
        btn.className = 'delete-btn';
        btn.textContent = 'Delete';

        li.append(span, btn);
        fragment.appendChild(li);
    });

    taskList.appendChild(fragment);
    
    const count = tasks.filter(t => !t.completed).length;
    itemsLeft.textContent = `${count} items left`;
}


taskList.addEventListener('click', (e) => {
    const li = e.target.closest('.task-item');
    if (!li) return;

    const id = Number(li.dataset.id);
    const index = tasks.findIndex(t => t.id === id);

    if (e.target.classList.contains('delete-btn')) {
        tasks.splice(index, 1);
    } else {
        tasks[index].completed = !tasks[index].completed;
    }
    render();
});

function handleAddTask() {
    const value = taskInput.value.trim();
    if (!value) return;

    tasks.push({
        id: Date.now(),
        text: value,
        completed: false
    });

    taskInput.value = '';
    render();
}

addBtn.addEventListener('click', handleAddTask);
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleAddTask();
});


filterGroup.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        render();
    }
});

render();