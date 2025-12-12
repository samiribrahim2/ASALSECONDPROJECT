const addTaskButton = document.getElementById("addTaskButton");
const taskInput = document.getElementById("myInput");
const todoList = document.getElementById("todoList");
const result = document.getElementById("inputVal");

const editTaskModal = document.getElementById("editTaskModal");
const editTaskInput = document.getElementById("editTaskInput");
const saveEditButton = document.getElementById("saveEditButton");
const closeEditModalButton = document.querySelector(".close-btn");

const deleteModal = document.getElementById("deleteModal");
const deleteModalText = document.getElementById("deleteModalText");
const confirmDeleteButton = document.getElementById("confirmDelete");
const cancelDeleteButton = document.getElementById("cancelDelete");
const closeDeleteModalButton = document.querySelector(".close-button");

const deleteDoneButton = document.getElementById("deletdoneButton");
const deleteAllButton = document.getElementById("deletallButton");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let taskToEditIndex = null;
let taskToDeleteIndex = null;
let deleteAction = null;

updateList();


document.getElementById("showAll").addEventListener("click", () => updateList("all"));
document.getElementById("showDone").addEventListener("click", () => updateList("done"));
document.getElementById("showTodo").addEventListener("click", () => updateList("todo"));


addTaskButton.addEventListener("click", () => {
  const inputValue = taskInput.value.trim();

  if (inputValue === "") return showMessage("Task cannot be empty.", "red");
  if (inputValue.length < 5)
    return showMessage("Task must be at least 5 characters long.", "red");
  if (/^\d/.test(inputValue))
    return showMessage("Task cannot start with a number.", "red");

  const isDuplicate = tasks.some(
    (task) => task.name.toLowerCase() === inputValue.toLowerCase()
  );
  if (isDuplicate) return showMessage("Task already exists.", "red");

  tasks.push({ name: inputValue, done: false });

  updateList();
  taskInput.value = "";
  saveTasks();
});


function openEditModal(index) {
  taskToEditIndex = index;
  editTaskInput.value = tasks[index].name;
  editTaskModal.style.display = "block";
}

function closeEditModal() {
  editTaskModal.style.display = "none";
}

saveEditButton.addEventListener("click", () => {
  const updatedTaskName = editTaskInput.value.trim();
  const result2 = document.getElementById("demo");

  if (updatedTaskName === "") {
    result2.textContent = "Task cannot be empty.";
    result2.style.color = "red";
    return;
  }
  if (updatedTaskName.length < 5) {
    result2.textContent = "Task must be at least 5 characters long.";
    result2.style.color = "red";
    return;
  }
  if (/^\d/.test(updatedTaskName)) {
    result2.textContent = "Task cannot start with a number.";
    result2.style.color = "red";
    return;
  }

  tasks[taskToEditIndex].name = updatedTaskName;
  saveTasks();
  updateList();
  closeEditModal();
});

closeEditModalButton.addEventListener("click", closeEditModal);

window.addEventListener("click", (event) => {
  if (event.target === editTaskModal) closeEditModal();
});


function showDeleteModal(action) {
  deleteModal.style.display = "block";

  if (action === "single")
    deleteModalText.textContent = "Are you sure you want to delete this task?";
  else if (action === "all")
    deleteModalText.textContent = "Are you sure you want to delete all tasks?";
  else if (action === "done")
    deleteModalText.textContent =
      "Are you sure you want to delete all completed tasks?";
}

function closeDeleteModal() {
  deleteModal.style.display = "none";
}

cancelDeleteButton.addEventListener("click", closeDeleteModal);

window.addEventListener("click", (event) => {
  if (event.target === deleteModal) closeDeleteModal();
});


deleteAllButton.addEventListener("click", () => {
  deleteAction = "all";
  showDeleteModal(deleteAction);
});

deleteDoneButton.addEventListener("click", () => {
  deleteAction = "done";
  showDeleteModal(deleteAction);
});


confirmDeleteButton.addEventListener("click", () => {
  if (deleteAction === "all") {
    tasks = [];
  } else if (deleteAction === "done") {
    tasks = tasks.filter((task) => !task.done);
  } else if (taskToDeleteIndex !== null) {
    tasks.splice(taskToDeleteIndex, 1);
  }

  saveTasks();
  updateList();
  closeDeleteModal();
});


function updateList(filter = "all") {
  todoList.innerHTML = "";

  const filteredTasks = tasks.filter((task) => {
    if (filter === "done") return task.done;
    if (filter === "todo") return !task.done;
    return true;
  });

  if (filteredTasks.length === 0) {
    const noTasksMessage = document.createElement("li");
    noTasksMessage.textContent = "No tasks.";
    noTasksMessage.className = "no-tasks-message";
    todoList.appendChild(noTasksMessage);
    return;
  }

  filteredTasks.forEach((task, index) => {
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.className = "task-checkbox";
    checkbox.addEventListener("change", () => {
      tasks[index].done = checkbox.checked;
      saveTasks();
      updateList(filter);
    });

    const taskName = document.createElement("span");
    taskName.textContent = task.name;
    taskName.className = task.done ? "task-name done" : "task-name";

    const actionsContainer = document.createElement("div");
    actionsContainer.className = "actions";

    const editButton = document.createElement("button");
    editButton.className = "edit-button";
    editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
    editButton.addEventListener("click", () => openEditModal(index));

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.addEventListener("click", () => {
      taskToDeleteIndex = index;
      showDeleteModal("single");
    });

    actionsContainer.appendChild(editButton);
    actionsContainer.appendChild(deleteButton);

    taskItem.appendChild(taskName);
    taskItem.appendChild(checkbox);
    taskItem.appendChild(actionsContainer);

    todoList.appendChild(taskItem);
  });

  updateDeleteButtonsState();
}


function updateDeleteButtonsState() {
  deleteAllButton.disabled = tasks.length === 0;
  deleteDoneButton.disabled = tasks.filter((task) => task.done).length === 0;
}

function showMessage(message, color) {
  result.textContent = message;
  result.style.color = color;
  setTimeout(() => (result.textContent = ""), 1000);
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function resetButtonText() {
  addTaskButton.textContent = "Add Task";
}