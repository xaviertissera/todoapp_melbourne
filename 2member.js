// Function to add a task
function addTask() {
    let taskInputElement = document.getElementById('taskInput');
    let taskInput = taskInputElement.value.trim();
    let taskDate = document.getElementById('taskDate').value;
    let taskPriority = document.getElementById('taskPriority').value;
    let taskReminder = document.getElementById('taskReminder').value;
    let taskCategory = document.getElementById('taskCategory').value;

    // Validation: Ensure task and date are provided
    if (taskInput === "" || taskDate === "") {
        alert("Please enter a task and a due date.");
        return;
    }

    // Prevent adding empty or whitespace-only tasks
    if (taskInput === "") {
        alert("Please enter a valid task.");
        return;
    }

    // Add task to list
    let taskList = document.getElementById('taskList');
    let li = document.createElement('li');
    li.className = `${taskPriority}-priority ${taskCategory}-category`; // Set class based on priority and category
    li.setAttribute('data-category', taskCategory); // Store category in data attribute
    li.setAttribute('data-reminder', taskReminder); // Store reminder in data attribute
    li.innerHTML = `
        <span>${taskInput}</span> - <small>Due: ${new Date(taskDate).toLocaleDateString()}</small>
        <div>
            <button class="edit-btn" aria-label="Edit task" onclick="editTask(this)">Edit</button>
            <button class="complete-btn" aria-label="Mark task as complete" onclick="completeTask(this)">Complete</button>
            <button class="remove-btn" aria-label="Remove task" onclick="removeTask(this)">Remove</button>
        </div>
    `;
    li.style.opacity = 0; // Add fade-in animation
    taskList.appendChild(li);
    setTimeout(() => { li.style.opacity = 1; }, 100);

    // Set a reminder for the task if due date is in the future
    let taskDueDate = new Date(taskDate);
    let now = new Date();
    let timeDiff = taskDueDate - now;

    // Convert reminder value to milliseconds
    let reminderTime = 0;
    switch (taskReminder) {
        case '15m':
            reminderTime = 15 * 60 * 1000;
            break;
        case '30m':
            reminderTime = 30 * 60 * 1000;
            break;
        case '1h':
            reminderTime = 60 * 60 * 1000;
            break;
        case '2h':
            reminderTime = 2 * 60 * 60 * 1000;
            break;
        case '1d':
            reminderTime = 24 * 60 * 60 * 1000;
            break;
        default:
            reminderTime = 0;
    }

    if (reminderTime > 0) {
        let reminderTimeDiff = timeDiff - reminderTime;
        if (reminderTimeDiff > 0) {
            setTimeout(() => {
                alert(`Reminder: Task "${taskInput}" is due soon!`);
            }, reminderTimeDiff);
        }
    }

    // Clear input fields after adding task
    taskInputElement.value = "";
    document.getElementById('taskDate').value = "";
    document.getElementById('taskPriority').value = "low"; // Reset priority
    document.getElementById('taskReminder').value = "none"; // Reset reminder
    document.getElementById('taskCategory').value = "work"; // Reset category

    // Save tasks to localStorage and update the progress bar
    saveTasks();
    updateProgressBar();
    updateAddButtonState();
}

// Function to save tasks to localStorage
function saveTasks() {
    let tasks = [];
    let taskList = document.getElementById('taskList').children;

    // Iterate through all tasks and store their text, priority, reminder, category, and completion status
    for (let i = 0; i < taskList.length; i++) {
        let taskText = taskList[i].querySelector('span').textContent;
        let taskPriority = taskList[i].className.split(' ')[0]; // Extract priority class
        let taskReminder = taskList[i].getAttribute('data-reminder'); // Get reminder
        let taskCategory = taskList[i].getAttribute('data-category'); // Get category
        let isCompleted = taskList[i].querySelector('span').style.textDecoration === "line-through";
        tasks.push({ text: taskText, priority: taskPriority, reminder: taskReminder, category: taskCategory, completed: isCompleted });
    }

    // Save tasks to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from localStorage when the page loads
function loadTasks() {
    let savedTasks = JSON.parse(localStorage.getItem('tasks'));

    // If there are saved tasks, recreate them in the UI
    if (savedTasks !== null) {
        let taskList = document.getElementById('taskList');
        for (let task of savedTasks) {
            let li = document.createElement('li');
            li.className = `${task.priority}-priority ${task.category}-category`; // Set class based on priority and category
            li.setAttribute('data-reminder', task.reminder); // Set reminder data
            li.setAttribute('data-category', task.category); // Set category data
            li.innerHTML = `
                <span style="text-decoration: ${task.completed ? 'line-through' : 'none'}; color: ${task.completed ? '#6c757d' : '#000'}">${task.text}</span>
                <div>
                    <button class="edit-btn" aria-label="Edit task" onclick="editTask(this)">Edit</button>
                    <button class="complete-btn" aria-label="Mark task as complete" onclick="completeTask(this)">Complete</button>
                    <button class="remove-btn" aria-label="Remove task" onclick="removeTask(this)">Remove</button>
                </div>
            `;
            taskList.appendChild(li);
        }
    }

    // Update the progress bar after loading tasks
    updateProgressBar();
}

// Function to update the progress bar
function updateProgressBar() {
    let taskList = document.getElementById('taskList').children;
    let totalTasks = taskList.length;
    let completedTasks = 0;

    // Count completed tasks
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].querySelector('span').style.textDecoration === "line-through") {
            completedTasks++;
        }
    }

    // Calculate percentage and update the progress bar
    let progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    document.getElementById('progressBar').style.width = progress + '%';
}

// Function to remove a task
function removeTask(button) {
    let taskItem = button.parentElement.parentElement;

    // Confirm task deletion
    if (confirm("Are you sure you want to remove this task?")) {
        // Fade-out animation before removing task
        taskItem.style.opacity = 0;
        setTimeout(() => {
            taskItem.remove();
            saveTasks();  // Update saved tasks after removal
            updateProgressBar();  // Update progress bar after removal
        }, 300);
    }
}

// Function to edit a task
function editTask(button) {
    let taskItem = button.parentElement.parentElement;
    let taskText = taskItem.querySelector('span').textContent;
    let newTaskText = prompt("Edit task:", taskText);

    // Update task if new text is provided
    if (newTaskText !== null && newTaskText.trim() !== "") {
        taskItem.querySelector('span').textContent = newTaskText.trim();
        saveTasks();
    }
}

// Function to mark a task as complete/incomplete
function completeTask(button) {
    let taskItem = button.parentElement.parentElement;
    let span = taskItem.querySelector('span');

    // Toggle line-through to mark completion
    if (span.style.textDecoration === "line-through") {
        span.style.textDecoration = "none";
        span.style.color = "#000";
    } else {
        span.style.textDecoration = "line-through";
        span.style.color = "#6c757d";
    }
    saveTasks();
    updateProgressBar();  // Update progress bar after marking task as complete/incomplete
}

// Function to filter tasks by category
function filterTasks() {
    let selectedCategory = document.getElementById('categoryFilter').value;
    let taskList = document.getElementById('taskList').children;

    for (let i = 0; i < taskList.length; i++) {
        let taskCategory = taskList[i].getAttribute('data-category');
        if (selectedCategory === 'all' || taskCategory === selectedCategory) {
            taskList[i].style.display = '';
        } else {
            taskList[i].style.display = 'none';
        }
    }
}

// Function to enable or disable the Add Task button based on the input field state
function updateAddButtonState() {
    let taskInput = document.getElementById('taskInput').value.trim();
    let addButton = document.querySelector('button[onclick="addTask()"]');
    addButton.disabled = taskInput === "";
}

// Load tasks and add event listeners when the window loads
window.onload = function() {
    loadTasks();
    document.getElementById('categoryFilter').addEventListener('change', filterTasks);
    document.getElementById('taskInput').addEventListener('input', updateAddButtonState);
};
