import createStorage from './localStorage.js'

interface Todo {
  name: string,
  completed: boolean
}

const todoStorage = createStorage('TODO')
const todos: Array<Todo> = todoStorage.get()

function getTodoHTML(todo: Todo): string {
  return `	
  <li class="${todo.completed ? 'completed' : ''}">
    <div class="view">
      <input class="toggle" type="checkbox" ${todo.completed ? 'cheked' : ''} />
      <label>${todo.name}</label>
      <button class="destroy"></button>
    </div>
    <input class="edit" value="${todo.name}" />
  </li>
  `
}

function renderTodoList(todos: Todo[], listEl: HTMLUListElement): void {
  const htmlItems: string = todos.map(todo => getTodoHTML(todo)).join('')
  listEl.innerHTML = htmlItems
}

const input = document.querySelector('.new-todo') as HTMLInputElement
const list = document.querySelector('.todo-list') as HTMLUListElement

renderTodoList(todos, list)

input.addEventListener('keydown', (event: KeyboardEvent): void => {
  if (event.key == 'Enter') {
    const todoItem: Todo = {
      name: input.value,
      completed: false
    }

    list.innerHTML += getTodoHTML(todoItem)
    todos.push(todoItem)
    todoStorage.update(todos)
    
    input.value = ''
    input.focus()
  }
})

list.addEventListener('click', (event: MouseEvent): void => {
  const clickedEl = event.target as HTMLElement
  // Toggle completed state of todo
  if (clickedEl.tagName == 'INPUT') {
    const toggleCompletedInput = clickedEl as HTMLInputElement
    const todoItemEL = toggleCompletedInput.closest('li')!
    const todoName = todoItemEL.innerText
    const todo = todos.find(todo => todo.name == todoName)!

    if (toggleCompletedInput.checked) {
      todoItemEL.classList.add('completed')
      todo.completed = true
    }
    else {
      todoItemEL.classList.remove('completed')
      todo.completed = false
    }

    todoStorage.update(todos)
  }

  // Delete todo
  if (clickedEl.classList.contains('destroy')) {
    const deleteBtn = clickedEl as HTMLButtonElement
    const todoItemEL = deleteBtn.closest('li')!
    const todoName = todoItemEL.innerText
    const todoIndex = todos.findIndex(todo => todo.name == todoName)!

    todos.splice(todoIndex, 1)
    todoStorage.update(todos)
    todoItemEL.remove()
  }
})