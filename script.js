let tasks = [];

const taskInput = document.querySelector('#taskInput');
const subject = document.querySelector('#subject');
const taskDate = document.querySelector('#taskDate');
const priority = document.querySelector('#priority');
const addTaskBtn = document.querySelector('#addTaskBtn');
const taskList = document.querySelector('#taskList');
const totalTasks = document.querySelector("#totalTasks");
const completedTasks = document.querySelector("#completedTasks");
const pendingTasks = document.querySelector("#pendingTasks");
const progressBar = document.querySelector("#progressBar");
const progressText = document.querySelector("#progressText");
const searchTask = document.querySelector("#searchTask");
const allBtn = document.querySelector('#allBtn');
const pendingBtn = document.querySelector('#pendingBtn');
const completedBtn = document.querySelector('#completedBtn');
const highBtn = document.querySelector('#highBtn');
const mediumBtn = document.querySelector('#mediumBtn');
const lowBtn = document.querySelector('#lowBtn');


let total = 0;
let completed = 0;
let pending = 0;


function createTask(task) {
    const li = document.createElement("li");

    li.dataset.status = task.completed ? "completed" : "pending";
    li.dataset.priority = task.priority;

    li.innerHTML = `
        <h3>${task.title}</h3>

        <p><strong>Subject:</strong> ${task.subject}</p>
        <p><strong>Date:</strong> ${task.date}</p>
        <p><strong>Priority:</strong> <span class="priority-text">${task.priority}</span></p>
    `;

    taskList.appendChild(li);

    if (task.completed) {
        li.style.textDecoration = "line-through";
        li.style.opacity = "0.6";
    }

    const prioritySpan = li.querySelector(".priority-text");

    if (task.priority === "High"){
        li.style.borderLeft = "6px solid red";
        prioritySpan.style.color = "red";
    }else if (task.priority === "Medium"){
        li.style.borderLeft = "6px solid orange";
        prioritySpan.style.color = "orange";
    }else if (task.priority === "Low"){
        li.style.borderLeft = "6px solid green";
        prioritySpan.style.color = "green";
    }

    const completeBtn = document.createElement("button");
    completeBtn.textContent = "Complete";
    li.appendChild(completeBtn);

    completeBtn.addEventListener("click", function () {
        if (task.completed) return;
        task.completed = true;
        li.dataset.status = "completed";
        li.style.textDecoration = "line-through";
        li.style.opacity = "0.6";
        completeBtn.disabled = true;
        completedBtn.textContent = "Completed";

        updateStatistics();
        updateProgress();

        saveTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    li.appendChild(deleteBtn);

    deleteBtn.addEventListener("click", function () {
        const index = tasks.indexOf(task);
        tasks.splice(index, 1);

        li.remove();

        updateStatistics();
        updateProgress();

        saveTasks();
    });
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);

        taskList.innerHTML = "";

        tasks.forEach(function(task) {
            createTask(task);
        });

        updateStatistics();
        updateProgress();
    }
}

function clearForm() {
    taskInput.value = "";
    subject.value = "";
    taskDate.value = "";
    priority.value = "";
}

function updateStatistics() {
    total = tasks.length;
    completed = tasks.filter(function(task){
        return task.completed;
    }).length;
    pending = total - completed;
    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
}

function updateProgress() {
    let progress;
    if(total === 0) {
        progress = 0;
    }else {
        progress = (completed / total) * 100;
    }
    
    progressBar.value = progress;
    progressText.textContent = `${Math.round(progress)}%`;
}

function filterTasks (filter) {
    const allTasks = document.querySelectorAll('#taskList li');
    allTasks.forEach(function (task) {
        if (filter === "all") {
            task.style.display = "block";
        } else if (filter === "pending") {
            if (task.dataset.status === "pending") {
                task.style.display = "block";
            } else {
                task.style.display = "none";
            }
        } else if (filter === "completed") {
            if (task.dataset.status === "completed") {
                task.style.display = "block";
            } else {
                task.style.display = "none";
            }
        } else if (filter === "high") {
            if (task.dataset.priority === "High") {
                task.style.display = "block";
            } else {
                task.style.display = "none";
            }
        } else if (filter === "medium") {
            if (task.dataset.priority === "Medium") {
                task.style.display = "block";
            } else {
                task.style.display = "none";
            }
        } else if (filter === "low") {
            if (task.dataset.priority === "Low") {
                task.style.display = "block";
            } else {
                task.style.display = "none";
            }
        }
    });
}

loadTasks();


addTaskBtn.addEventListener("click", function() {
    const task = taskInput.value;
    const selectedSubject = subject.value;
    const date = taskDate.value;
    const selectedPriority = priority.value;

    if (task === "" || selectedSubject === "" || date === "" || selectedPriority === "") {
        alert("Please fill in all fields. ");
        return;
    }

    const newTask = {
        title: task,
        subject: selectedSubject,
        date: date,
        priority: selectedPriority,
        completed: false
    };

    tasks.push(newTask);

    createTask(newTask);

    updateStatistics();
    updateProgress();

    saveTasks();

    clearForm();
});

searchTask.addEventListener("input", function () {
    const searchText = searchTask.value.toLowerCase();
    const allTasks = document.querySelectorAll("#taskList li");

    allTasks.forEach(function(task) {
        const taskText = task.textContent.toLowerCase();
        if (taskText.includes(searchText)) {
            task.style.display = "block";
        } else {
            task.style.display = "none";
        }
    });
});

allBtn.addEventListener("click", function () {
    filterTasks("all");
});

pendingBtn.addEventListener("click", function () {
    filterTasks("pending");
});

completedBtn.addEventListener("click", function () {
    filterTasks("completed");
});

highBtn.addEventListener("click", function () {
    filterTasks("high");
});

mediumBtn.addEventListener("click", function () {
    filterTasks("medium");
});

lowBtn.addEventListener("click", function () {
    filterTasks("low");
});
