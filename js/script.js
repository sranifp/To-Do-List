const taskInput = document.getElementById('task-input');
const priorityInput = document.getElementById('priority-input');
const dateInput = document.getElementById('date-input');
const btnSubmit = document.getElementById('btn-submit');
const todoListContainer = document.getElementById('todo-list');
const doneListContainer = document.getElementById('done-list');
const overdueListContainer = document.getElementById('overdue-list');
const btnDeleteAll = document.getElementById('btn-delete-all');
const timeDisplay = document.getElementById('current-time');

let tasks = JSON.parse(localStorage.getItem('karyawan_tasks')) || [];

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
}

function updateDateTime() {
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    const today = new Date();
    timeDisplay.innerText = today.toLocaleDateString('id-ID', options);
}

function saveToStorage() {
    localStorage.setItem('karyawan_tasks', JSON.stringify(tasks));
}

function renderTasks() {
    todoListContainer.innerHTML = '';
    doneListContainer.innerHTML = '';
    overdueListContainer.innerHTML = '';

    const todayStr = new Date().toISOString().split('T')[0];

    tasks.forEach((task, index) => {
        const taskCard = document.createElement('div');
        taskCard.className = `task-card ${task.isDone ? 'done-item' : ''}`;

        let priorityClass = 'p-medium';
        if (task.priority === 'High') priorityClass = 'p-high';
        if (task.priority === 'Low') priorityClass = 'p-low';

        const formattedDate = new Date(task.targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

        taskCard.innerHTML = `
            <div class="checkbox-container">
                <input type="checkbox" ${task.isDone ? 'checked' : ''} onchange="toggleTaskStatus(${index})">
            </div>
            <div class="task-content">
                <span class="priority-badge ${priorityClass}">${task.priority}</span>
                <div class="task-text">${task.text}</div>
                <div class="task-date">Batas: ${formattedDate}</div>
            </div>
            <button class="btn-delete" onclick="deleteSingleTask(${index})">×</button>
        `;

        if (task.isDone) {
            doneListContainer.appendChild(taskCard);
        } else if (task.targetDate < todayStr) {
            overdueListContainer.appendChild(taskCard);
        } else {
            todoListContainer.appendChild(taskCard);
        }
    });

    if (todoListContainer.innerHTML === '') {
        todoListContainer.innerHTML = '<div class="empty-info">Tidak ada tugas aktif</div>';
    }
    if (doneListContainer.innerHTML === '') {
        doneListContainer.innerHTML = '<div class="empty-info">Belum ada tugas selesai</div>';
    }
    if (overdueListContainer.innerHTML === '') {
        overdueListContainer.innerHTML = '<div class="empty-info">Tidak ada tugas terlambat</div>';
    }
}

function addTask() {
    const textValue = taskInput.value.trim();
    const priorityValue = priorityInput.value;
    const dateValue = dateInput.value;

    if (textValue === '') {
        alert('Kolom text area tugas tidak boleh kosong!');
        return;
    }

    if (dateValue === '') {
        alert('Silakan pilih batas hari pengerjaan!');
        return;
    }

    tasks.push({
        text: textValue,
        priority: priorityValue,
        targetDate: dateValue,
        isDone: false
    });

    taskInput.value = '';
    priorityInput.value = 'Medium';
    setDefaultDate();
    saveToStorage();
    renderTasks();
}

function toggleTaskStatus(index) {
    tasks[index].isDone = !tasks[index].isDone;
    saveToStorage();
    renderTasks();
}

function deleteSingleTask(index) {
    tasks.splice(index, 1);
    saveToStorage();
    renderTasks();
}

function deleteAllTasks() {
    if (tasks.length === 0) {
        alert('Daftar tugas sudah kosong!');
        return;
    }
    if (confirm('Apakah Anda yakin ingin menghapus seluruh agenda to do list yang telah dibuat?')) {
        tasks = [];
        saveToStorage();
        renderTasks();
    }
}

btnSubmit.addEventListener('click', addTask);
btnDeleteAll.addEventListener('click', deleteAllTasks);

updateDateTime();
setDefaultDate();
renderTasks();