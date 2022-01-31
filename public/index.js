import createStorage from './localStorage.js';
const todoStorage = createStorage('TODO');
const todos = todoStorage.get();
function getTodoHTML(todo) {
    return `	
  <li class="${todo.completed ? 'completed' : ''}">
    <div class="view">
      <input class="toggle" type="checkbox" ${todo.completed ? 'cheked' : ''} />
      <label>${todo.name}</label>
      <button class="destroy"></button>
    </div>
    <input class="edit" value="${todo.name}" />
  </li>
  `;
}
function renderTodoList(todos, listEl) {
    const htmlItems = todos.map(todo => getTodoHTML(todo)).join('');
    listEl.innerHTML = htmlItems;
}
const input = document.querySelector('.new-todo');
const list = document.querySelector('.todo-list');
renderTodoList(todos, list);
input.addEventListener('keydown', (event) => {
    if (event.key == 'Enter') {
        const todoItem = {
            name: input.value,
            completed: false
        };
        list.innerHTML += getTodoHTML(todoItem);
        todos.push(todoItem);
        todoStorage.update(todos);
        input.value = '';
        input.focus();
    }
});
list.addEventListener('click', (event) => {
    const clickedEl = event.target;
    // Toggle completed state of todo
    if (clickedEl.tagName == 'INPUT') {
        const toggleCompletedInput = clickedEl;
        const todoItemEL = toggleCompletedInput.closest('li');
        const todoName = todoItemEL.innerText;
        const todo = todos.find(todo => todo.name == todoName);
        if (toggleCompletedInput.checked) {
            todoItemEL.classList.add('completed');
            todo.completed = true;
        }
        else {
            todoItemEL.classList.remove('completed');
            todo.completed = false;
        }
        todoStorage.update(todos);
    }
    // Delete todo
    if (clickedEl.classList.contains('destroy')) {
        const deleteBtn = clickedEl;
        const todoItemEL = deleteBtn.closest('li');
        const todoName = todoItemEL.innerText;
        const todoIndex = todos.findIndex(todo => todo.name == todoName);
        todos.splice(todoIndex, 1);
        todoStorage.update(todos);
        todoItemEL.remove();
    }
});
