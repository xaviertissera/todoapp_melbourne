window.onload = function() {
    loadTasks();
};

function saveTasks() {
    try {
        let tasks = [];
        let taskListItems = document.getElementById('taskList').children;

        // Collect task data for saving
        for (let taskItem of taskListItems) {
            let taskText = taskItem.querySelector('span').textContent;
            let isCompleted = taskItem.querySelector('span').style.textDecoration === "line-through";
            tasks.push({ text: taskText, completed: isCompleted });
        }

        // Save tasks to localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));
        console.log("Tasks saved successfully.");
    } catch (error) {
        console.error("Failed to save tasks:", error);
    }
}

function loadTasks() {
    try {
        let savedTasks = JSON.parse(localStorage.getItem('tasks'));

        if (savedTasks && Array.isArray(savedTasks)) {
            let taskList = document.getElementById('taskList');
            taskList.innerHTML = "";  // Clear any existing tasks

            // Create document fragment for performance
            let fragment = document.createDocumentFragment();

            savedTasks.forEach(task => {
                let taskItem = createTaskElement(task.text, task.completed);
                fragment.appendChild(taskItem);
            });

            taskList.appendChild(fragment);
            console.log("Tasks loaded successfully.");
        }
    } catch (error) {
        console.error("Failed to load tasks:", error);
    }
}

// Reusable function to create a task element
function createTaskElement(taskText, isCompleted = false) {
    let li = document.createElement('li');
    li.innerHTML = `
        <span style="text-decoration: ${isCompleted ? 'line-through' : 'none'}; color: ${isCompleted ? '#6c757d' : '#000'}">${taskText}</span>
        <div>
            <button class="edit-btn" aria-label="Edit task" onclick="editTask(this)">Edit</button>
            <button class="complete-btn" aria-label="Mark task as complete" onclick="completeTask(this)">Complete</button>
            <button class="remove-btn" aria-label="Remove task" onclick="removeTask(this)">Remove</button>
        </div>
    `;

    return li;
}

// Function to add a new task
function addTask() {
    let taskInput = document.getElementById('taskInput').value.trim();
    if (taskInput === "") {
        alert("Please enter a task.");
        return;
    }

    let taskList = document.getElementById('taskList');
    let taskItem = createTaskElement(taskInput);
    
    // Add the task to the list with animation
    taskItem.style.opacity = 0;
    taskList.appendChild(taskItem);
    setTimeout(() => taskItem.style.opacity = 1, 100);

    document.getElementById('taskInput').value = "";  // Clear input field
    saveTasks();
}

function editTask(button) {
    let taskItem = button.parentElement.parentElement;
    let taskSpan = taskItem.querySelector('span');
    let taskText = taskSpan.textContent;

    let newTaskText = prompt("Edit task:", taskText);
    if (newTaskText !== null && newTaskText.trim() !== "") {
        taskSpan.textContent = newTaskText.trim();
        saveTasks();
    }
}

function completeTask(button) {
    let taskItem = button.parentElement.parentElement;
    let taskSpan = taskItem.querySelector('span');

    if (taskSpan.style.textDecoration === "line-through") {
        taskSpan.style.textDecoration = "none";
        taskSpan.style.color = "#000";
    } else {
        taskSpan.style.textDecoration = "line-through";
        taskSpan.style.color = "#6c757d";
    }
// Function to trigger confetti animation
function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

    saveTasks();
}

function removeTask(button) {
    let taskItem = button.parentElement.parentElement;
    taskItem.style.opacity = 0;
    setTimeout(() => {
        taskItem.remove();
        saveTasks();
    }, 300);
}
