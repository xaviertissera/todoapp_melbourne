// Function to save tasks to localStorage
function saveTasks() {
    let tasks = [];
    let taskListItems = document.querySelectorAll('#taskList li');
    taskListItems.forEach(item => {
        let taskText = item.querySelector('span').textContent;
        let taskDate = item.querySelector('small').textContent.replace('Due: ', '');
        let taskPriority = item.className.split('-')[0]; // Extract priority from class name

        tasks.push({
            text: taskText,
            date: new Date(taskDate).toISOString().split('T')[0],
            priority: taskPriority
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to edit a task
function editTask(button) {
    let taskItem = button.parentElement.parentElement;
    let taskSpan = taskItem.querySelector('span');
    let taskText = taskSpan.textContent;

    // Prompt the user to edit the task
    let newTaskText = prompt("Edit task:", taskText);

    // Validate the input to prevent empty or whitespace-only edits
    if (newTaskText !== null) {
        newTaskText = newTaskText.trim();
        if (newTaskText === "") {
            alert("Task cannot be empty.");
        } else if (newTaskText === taskText) {
            alert("No changes were made.");
        } else {
            // Update the task's text and save changes
            taskSpan.textContent = newTaskText;
            saveTasks();
            updateCalendar(); // Update the calendar view
        }
    }
}

// Function to mark a task as complete or incomplete
function completeTask(button) {
    let taskItem = button.parentElement.parentElement;
    let taskSpan = taskItem.querySelector('span');
    

    // Toggle the task's completion status
    if (taskSpan.style.textDecoration === "line-through") {
        // Mark the task as incomplete
        taskSpan.style.textDecoration = "none";
        taskSpan.style.color = "#000";
    } else {
        // Mark the task as complete
        taskSpan.style.textDecoration = "line-through";
        taskSpan.style.color = "#6c757d";
    }

    // Save the updated task status
    saveTasks();
}

// Function to remove a task
function removeTask(button) {
    let taskItem = button.parentElement.parentElement;
    taskItem.remove();
    saveTasks(); // Update localStorage
    updateCalendar(); // Update the calendar view
}

// Function to add a task
function addTask() {
    let taskInput = document.getElementById('taskInput').value.trim();
    let taskDate = document.getElementById('taskDate').value;
    let taskPriority = document.getElementById('taskPriority').value;

    // Validation: Ensure task and date are provided
    if (taskInput === "" || taskDate === "") {
        alert("Please enter a task and a due date.");
        return;
    }

    // Add task to list
    let taskList = document.getElementById('taskList');
    let li = document.createElement('li');
    li.className = `${taskPriority}-priority`; // Set class based on priority
    li.innerHTML = `
        <span>${taskInput}</span> - <small>Due: ${new Date(taskDate).toLocaleDateString()}</small>
        <div>
            <button class="edit-btn" onclick="editTask(this)">Edit</button>
            <button class="complete-btn" onclick="completeTask(this)">Complete</button>
            <button class="remove-btn" onclick="removeTask(this)">Remove</button>
        </div>
    `;
    taskList.appendChild(li);

    // Set a reminder for the task if due date is in the future
    let taskDueDate = new Date(taskDate);
    let now = new Date();
    let timeDiff = taskDueDate - now;

    if (timeDiff > 0) {
        setTimeout(() => {
            alert(`Reminder: Task "${taskInput}" is due today!`);
        }, timeDiff);
    }

    // Clear input fields after adding task
    document.getElementById('taskInput').value = "";
    document.getElementById('taskDate').value = "";
    document.getElementById('taskPriority').value = "low"; // Reset priority

    // Save tasks to localStorage and update the progress bar
    saveTasks();
    updateProgressBar();
    updateCalendar(); // Update the calendar view
}

// Function to update the calendar view
function updateCalendar() {
    let calendarEl = document.getElementById('calendar');
    let calendar = FullCalendar.getCalendar(calendarEl);
    calendar.getEvents().forEach(event => event.remove());
    calendar.addEventSource(loadTasksForCalendar());
}

// Function to load tasks into the calendar
function loadTasksForCalendar() {
    let savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let events = savedTasks.map(task => {
        let taskDate = new Date(task.date).toISOString().split('T')[0];
        return {
            title: task.text,
            start: taskDate,
            color: getPriorityColor(task.priority)
        };
    });
    return events;
}

// Function to get color based on task priority
function getPriorityColor(priority) {
    switch (priority) {
        case 'high': return 'red';
        case 'medium': return 'orange';
        case 'low': return 'green';
        default: return 'gray';
    }
}

// Function to update progress bar
function updateProgressBar() {
    let taskListItems = document.querySelectorAll('#taskList li');
    let totalTasks = taskListItems.length;
    let completedTasks = Array.from(taskListItems).filter(item => 
        item.querySelector('span').style.textDecoration === 'line-through'
    ).length;
    let progress = (completedTasks / totalTasks) * 100;
    document.querySelector('.progress-bar').style.width = progress + '%';
}
