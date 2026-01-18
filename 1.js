const now = new Date();
const currentYear = now.getFullYear();
const startTime = new Date(currentYear, 0, 1, 0, 0, 0);
const endTime = new Date(currentYear + 1, 0, 1, 0, 0, 0);

const totalMilliseconds = endTime.getTime() - startTime.getTime();
const infoElement = document.getElementById("info");
const headingElement = document.getElementById("heading");

if (headingElement) {
    headingElement.textContent = `${currentYear} 年已经过去`;
}

const getProgressPercent = () => {
    const elapsed = Date.now() - startTime.getTime();
    return (elapsed / totalMilliseconds) * 100;
};

const renderProgress = () => {
    const percent = getProgressPercent();
    const clamped = Math.min(Math.max(percent, 0), 100);
    infoElement.textContent = `${clamped.toFixed(6)}%`;
};

renderProgress();
setInterval(renderProgress, 1000);

// --- TODO List Logic ---

const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

// Load todos from localStorage
let todos = [];
try {
    const stored = localStorage.getItem('todos');
    if (stored) todos = JSON.parse(stored);
} catch (e) {
    console.error("Failed to parse todos from localStorage", e);
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    if (!todoList) return;
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodo(index));
        
        // Text
        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = todo.text;
        
        // Delete Button
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.innerHTML = '&times;';
        delBtn.title = "删除";
        delBtn.setAttribute('aria-label', '删除任务'); // Accessibility
        delBtn.addEventListener('click', () => deleteTodo(index));
        
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(delBtn);
        todoList.appendChild(li);
    });
}

function addTodo() {
    const text = todoInput.value.trim();
    if (text) {
        todos.push({ text, completed: false });
        saveTodos();
        renderTodos();
        todoInput.value = '';
    }
}

function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
}

function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
}

// Event Listeners
if (addBtn && todoInput) {
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
}

// Initial Render
if (todoList) {
    renderTodos();
}
