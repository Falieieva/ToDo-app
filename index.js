"use strict";

const STORAGE_KEY = "tasks";

const form = document.querySelector(".create-task-form");
const taskInput = document.querySelector(".task-input");
const filterInput = document.querySelector(".filter-input");
const taskList = document.querySelector(".collection");
const clearButton = document.querySelector(".clear-tasks");

const getTasksFromLocalStorage = () => {
  const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  return tasks;
};

const storeTaskInLocalStorage = (task) => {
  const tasks = getTasksFromLocalStorage();
  tasks.push(task);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const removeTaskFromLocalStorage = (deletedIndex) => {
  const tasks = getTasksFromLocalStorage();
  tasks.splice(deletedIndex, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const clearTasksFromLocalStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};

const getTasks = () => {
  const tasks = getTasksFromLocalStorage();

  tasks.forEach((task, index) => {
    
    const li = document.createElement("li");
    li.className = "collection-item";
    li.textContent = task;

    const taskEdit = document.createElement("span");
    taskEdit.className = "edit-item";
    taskEdit.innerHTML = '<i class="fa fa-pencil"></i>'; 
    li.append(taskEdit);

    const taskText = document.createElement("span");
    taskText.className = "delete-item";
    taskText.innerHTML = '<i class="fa fa-remove"></i>';
    li.append(taskText);

    taskList.append(li);

  });
};

const addTask = (event) => {
  event.preventDefault();

  if (taskInput.value.trim() === "") {
    return;
  }

  const li = document.createElement("li");
  li.className = "collection-item";
  li.textContent = taskInput.value;

  const taskEdit = document.createElement("span");
  taskEdit.className = "edit-item";
  taskEdit.innerHTML = '<i class="fa fa-pencil"></i>'; 
  li.append(taskEdit);

  const taskText = document.createElement("span");
  taskText.className = "delete-item";
  taskText.innerHTML = '<i class="fa fa-remove"></i>';
  li.append(taskText);

  taskList.append(li);

  storeTaskInLocalStorage(taskInput.value);

  taskInput.value = "";

};

const removeTask = (event) => {
  const isDeleteIcon = event.target.classList.contains("fa-remove");
  const isEditIcon = event.target.classList.contains("fa-pencil");

  if (isDeleteIcon) {
    const isApproved = confirm("Ви впевнені що хочете видалити це завдання?");

    if (isApproved) {
      const deletedLi = event.target.closest("li");
      const tasks = Array.from(taskList.children);
      const deletedIndex = tasks.indexOf(deletedLi);
      deletedLi.remove();

      removeTaskFromLocalStorage(deletedIndex);
    }
  }

  if (isEditIcon) {
    const editedLi = event.target.closest("li");
    const tasks = Array.from(taskList.children);
    const editedIndex = tasks.indexOf(editedLi);
    const editedTask = editedLi.firstChild;
    const editedText = editedTask.textContent.trim();
    const newText = prompt("Редагувати завдання", editedText);

    if (newText !== null && newText !== "") {
      editedTask.textContent = newText;
      const tasks = getTasksFromLocalStorage();
      tasks[editedIndex] = newText;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }
};


const clearTasks = () => {
  taskList.innerHTML = "";
  clearTasksFromLocalStorage();
};

const filterTasks = (event) => {
  const text = event.target.value.toLowerCase();
  const list = document.querySelectorAll(".collection-item");

  list.forEach((task) => {
    const item = task.firstChild.textContent.toLowerCase();

    if (item.includes(text)) {
      task.style.display = "list-item";
    } else {
      task.style.display = "none";
    }
  });
};

getTasks();

form.addEventListener("submit", addTask);

taskList.addEventListener("click", removeTask);

clearButton.addEventListener("click", clearTasks);

filterInput.addEventListener("input", filterTasks);