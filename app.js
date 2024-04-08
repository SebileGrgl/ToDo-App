const addInput = document.querySelector("#add-todo-input");
const addBtn = document.querySelector("#add-todo-btn");
const todoListContainer = document.querySelector(".todo-list-container");
const addBox = document.querySelector(".add-box");
const options = document.querySelectorAll("input[name=option]");
let currentIndex = 0;

function addtodo() {
  const todoList = JSON.parse(localStorage.getItem("todoList")) || [];
  const newTodo = addInput.value;
  if (newTodo !== "") {
    const todoItem = {
      id: (currentIndex += 1),
      title: newTodo,
      completed: false,
    };
    todoList.unshift(todoItem);
    localStorage.setItem("todoList", JSON.stringify(todoList));
    addInput.value = "";

    const checkedOption = Array.from(options).find((option) => option.checked);
    if (checkedOption === undefined) {
      showTodoList();
    } else {
      showFilteredTodos(checkedOption.value);
    }
  } else {
    addBox.classList.add("shake-input");
    setTimeout(() => {
      addBox.classList.remove("shake-input");
    }, 300);
  }
}
addBtn.addEventListener("click", () => {
  addtodo();
});

addInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addtodo();
  }
});

function showTodoList() {
  const listTodo = JSON.parse(localStorage.getItem("todoList")) || [];
  todoListContainer.innerHTML = listTodo
    .map((item) => {
      if (item.completed === false) {
        return ` <div id="todo-list-item${item.id}" class="todo-list-item">
<div id="main-item${item.id}" class="main-item"><div>
  <div onclick="check(${item.id})" id="check-image-box${item.id}" class="check-images-box">
    <img
      src="images/noun-unchecked-checkbox-4547505.svg"
      alt="unchecked-checkbox"
      id="checkbox${item.id}"
    />
    
  </div>
  <p id="todo-title${item.id}" >${item.title}</p>
</div>
<div class="edit-delete-box">
<img onclick="editTodo(${item.id})"   src="images/editing.png" alt="edit-icon"><img  onclick="deleteTodo(${item.id})" src="images/delete.png" alt="delete-icon">
</div>
</div>
</div>`;
      } else {
        return ` <div id="todo-list-item${item.id}" class="todo-list-item">
<div id="main-item${item.id}" class="main-item"><div>
  <div onclick="check(${item.id})" id="check-image-box${item.id}" class="check-images-box">
    <img
      src="images/noun-unchecked-checkbox-4547505.svg"
      alt="unchecked-checkbox"
      id="checkbox${item.id}"
    />
    <img id="check-icon" src="images/check-symbol.png"/>
  </div>
  <s id="todo-title${item.id}" >${item.title}</s>
</div>
<div class="edit-delete-box">
<img  onclick="deleteTodo(${item.id})" src="images/delete.png" alt="delete-icon">
</div>
</div>
</div>`;
      }
    })
    .join("");
}

showTodoList();

function deleteTodo(id) {
  const todoListToUpdate = JSON.parse(localStorage.getItem("todoList"));
  const filteredTodoList = todoListToUpdate.filter((item) => item.id !== id);
  for (
    currentIndex = 0;
    currentIndex < filteredTodoList.length;
    currentIndex++
  ) {
    filteredTodoList[currentIndex].id = currentIndex + 1;
  }
  localStorage.setItem("todoList", JSON.stringify(filteredTodoList));
  const checkedOption = Array.from(options).find((option) => option.checked);
  if (checkedOption === undefined) {
    showTodoList();
  } else {
    showFilteredTodos(checkedOption.value);
  }
}

function editTodo(id) {
  const todoListItem = document.querySelector(`#todo-list-item${id}`);
  const elementToEdit = document.querySelector(`#todo-title${id}`);
  const titletoEdit = elementToEdit.innerText;
  const mainItem = document.querySelector(`#main-item${id}`);
  mainItem.classList.add("display-none");
  const newDivToEdit = document.createElement("div");
  todoListItem.appendChild(newDivToEdit);
  newDivToEdit.classList.add(`div-to-edit`);
  newDivToEdit.id = `div-to-edit${id}`;
  newDivToEdit.innerHTML = `<input  id="edit-input${id}" onkeypress="enter(event,${id})" class="input-to-edit" type="text" value="${titletoEdit}"/><button onclick="completeEdit(${id})" id="btn${id}" class="apply-btn">Apply</button>`;
}
function enter(event, id) {
  if (event.key === "Enter") {
    completeEdit(id);
  }
}

function completeEdit(id) {
  const editInput = document.querySelector(`#edit-input${id}`);
  const mainItem = document.querySelector(`#main-item${id}`);
  const editDiv = document.querySelector(`#div-to-edit${id}`);
  const todoList = JSON.parse(localStorage.getItem("todoList"));
  const editedTitle = editInput.value;
  const editedTodoIndex = todoList.findIndex((item) => item.id === id);
  if (editedTodoIndex !== -1) {
    todoList[editedTodoIndex].title = editedTitle;
    localStorage.setItem("todoList", JSON.stringify(todoList));
    showTodoList();
  }

  mainItem.classList.remove("display-none");
  editDiv.remove();
}

function check(id) {
  const todoList = JSON.parse(localStorage.getItem("todoList"));
  const itemToCheck = todoList.find((item) => item.id === id);
  itemToCheck.completed = !itemToCheck.completed;
  const indextoUpdate = todoList.indexOf(itemToCheck);
  todoList.splice(indextoUpdate, 1);
  if (itemToCheck.completed) {
    todoList.push(itemToCheck);
  } else {
    todoList.unshift(itemToCheck);
  }

  localStorage.setItem("todoList", JSON.stringify(todoList));
  const checkedOption = Array.from(options).find((option) => option.checked);
  if (checkedOption === undefined) {
    showTodoList();
  } else {
    showFilteredTodos(checkedOption.value);
  }
}

const filterBox = document.querySelector("#filter-box");
const filterIcon = document.querySelector("#filter-icon");
filterIcon.addEventListener("click", () => {
  filterBox.classList.toggle("display-none");
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".filter-container")) {
    document.getElementById("filter-box").classList.add("display-none");
  }
});

function showFilteredTodos(filter) {
  const todoList = JSON.parse(localStorage.getItem("todoList"));
  if (filter === "Completed") {
    const completedTodos = todoList.filter((item) => {
      return item.completed === true;
    });

    todoListContainer.innerHTML =
      completedTodos.length > 0
        ? completedTodos
            .map((item) => {
              return ` <div id="todo-list-item${item.id}" class="todo-list-item">
      <div id="main-item${item.id}" class="main-item"><div>
        <div onclick="check(${item.id})" id="check-image-box${item.id}" class="check-images-box">
          <img
            src="images/noun-unchecked-checkbox-4547505.svg"
            alt="unchecked-checkbox"
            id="checkbox${item.id}"
     />
          <img id="check-icon" src="images/check-symbol.png"/>
        </div>
        <s id="todo-title${item.id}" >${item.title}</s>
      </div>
      <div class="edit-delete-box">
      <img  onclick="deleteTodo(${item.id})" src="images/delete.png" alt="delete-icon">
      </div>
      </div>
      </div>`;
            })
            .join("")
        : `<div class="empty-list-container"><img src="images/wind.png"/></div> `;
  } else if (filter === "Active") {
    const activeTodos = todoList.filter((item) => {
      return item.completed === false;
    });
    todoListContainer.innerHTML =
      activeTodos.length > 0
        ? activeTodos
            .map((item) => {
              return ` <div id="todo-list-item${item.id}" class="todo-list-item">
      <div id="main-item${item.id}" class="main-item"><div>
        <div onclick="check(${item.id})" id="check-image-box${item.id}" class="check-images-box">
          <img
            src="images/noun-unchecked-checkbox-4547505.svg"
            alt="unchecked-checkbox"
            id="checkbox${item.id}"
          />
          
        </div>
        <p id="todo-title${item.id}" >${item.title}</p>
      </div>
      <div class="edit-delete-box">
      <img onclick="editTodo(${item.id})"  src="images/editing.png" alt="edit-icon"><img  onclick="deleteTodo(${item.id})" src="images/delete.png" alt="delete-icon">
      </div>
      </div>
      </div>`;
            })
            .join("")
        : `<div class="empty-list-container"><img src="images/wind.png"/></div> `;
  } else {
    showTodoList();
  }
}

options.forEach((option) => {
  option.addEventListener("change", () => {
    if (option.checked) {
      showFilteredTodos(option.value);
    }
  });
});
