import createStorage from './localStorage.js'

interface Todo {
  name: string,
  completed: boolean
}

const todoStorage = createStorage('TODO')
let todos: Array<Todo> = todoStorage.get()

function getTodoHTML(todo: Todo): string {
  return `	
  <li draggable="true" class="todo-item ${todo.completed ? 'completed' : ''}">
    <div class="view">
      <input class="toggle" type="checkbox" ${todo.completed ? 'checked' : ''}/>
      <label>${todo.name}</label>
      <div class="control">
        <button class="editing-btn">
          <ion-icon name="create-outline"></ion-icon>
        </button>
        <button class="destroy">
          <ion-icon name="trash-outline"></ion-icon>
        </button>
      </div>
    </div>
    <input class="edit" value="${todo.name}" />
  </li>
  `
}

function renderTodoList(todos: Todo[], listEl: HTMLUListElement): void {
  const htmlItems: string = todos.map(todo => getTodoHTML(todo)).join('')
  listEl.innerHTML = htmlItems
}

function getItemLeft(): number {
  const itemLeft = todos.reduce((count: number, todo: Todo) => {
    return todo.completed ? count : count + 1
  }, 0)
  return itemLeft
}

const input = document.querySelector('.new-todo') as HTMLInputElement
const list = document.querySelector('.todo-list') as HTMLUListElement
const countEl = document.querySelector('.todo-count') as HTMLSpanElement
const filterBtns = document.querySelectorAll('.filters>li') as NodeListOf<HTMLLIElement>
const clearBtn = document.querySelector('.clear-completed') as HTMLButtonElement

renderTodoList(todos, list)
countEl.innerText = `${getItemLeft()} item left`

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
  if (clickedEl.classList.contains('toggle')) {
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

    countEl.innerText = `${getItemLeft()} item left`
    todoStorage.update(todos)
  }

  // Delete todo
  if (clickedEl.parentElement.classList.contains('destroy')) {
    const deleteBtn = clickedEl as HTMLButtonElement
    const todoItemEL = deleteBtn.closest('li')!
    const todoName = todoItemEL.innerText
    const todoIndex = todos.findIndex(todo => todo.name == todoName)!

    todos.splice(todoIndex, 1)
    todoStorage.update(todos)
    todoItemEL.remove()
    countEl.innerText = `${getItemLeft()} item left`
  }
  console.log(clickedEl)

  // Update todo
  if (clickedEl.parentElement.classList.contains('editing-btn')) {
    const labelEl = clickedEl as HTMLLabelElement
    const todoItemEL = labelEl.closest('li')!
    const inputEl = todoItemEL.querySelector('.edit') as HTMLInputElement
    console.log(document.querySelectorAll('.editing'))
    const editingEls = document.querySelectorAll('.editing') 
    editingEls.forEach(element => element.classList.remove('editing'))
    todoItemEL.classList.add('editing')
    inputEl.focus()
    // Move the cursor to the end
    const length = inputEl.value.length
    inputEl.setSelectionRange(length, length)
  }
})

list.addEventListener('dblclick', (event: MouseEvent): void => {
  const clickedEl = event.target as HTMLElement
  // Update todo
  if (clickedEl.tagName == 'LABEL') {
    const labelEl = clickedEl as HTMLLabelElement
    const todoItemEL = labelEl.closest('li')!
    const inputEl = todoItemEL.querySelector('.edit') as HTMLInputElement
    const editingEls = document.querySelectorAll('.editing') 
    editingEls.forEach(element => element.classList.remove('editing'))
    todoItemEL.classList.add('editing')
    inputEl.focus()
    console.log(inputEl)
  }
})

function cancelEditMode(): void {
  const editingTodoItems = document.querySelectorAll('.editing')
  editingTodoItems.forEach((item: HTMLLIElement) =>{
    const labelEl = item.querySelector('label') as HTMLLabelElement
    const editEl = item.querySelector('.edit') as HTMLInputElement
    item.classList.remove('editing')
    editEl.value = labelEl.innerText
  })
}

function saveEdit(): void {
  const editingTodoItem = document.querySelector('.editing')
  if (editingTodoItem) {
    const labelEl = editingTodoItem.querySelector('label')
    const editEl = editingTodoItem.querySelector('.edit') as HTMLInputElement
    const oldName = labelEl.innerText
    const todo = todos.find(todo => todo.name == oldName)

    // Update new todo
    todo.name = editEl.value
    todoStorage.update(todos)
    labelEl.innerText = editEl.value
    editingTodoItem.classList.remove('editing')
  }
}

addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key == 'Escape') {
    cancelEditMode()
  }

  if (event.key == 'Enter') {
    saveEdit()
  }
})

function filterTodo(filter: string) {
  if (filter == 'completed') 
    return todos.filter(todo => todo.completed)
  else if (filter == 'active') 
    return todos.filter(todo => !todo.completed)
  return todos;
}

function clearCompletedTodos() {
  todos = todos.filter(todo => !todo.completed)
  todoStorage.update(todos)
  renderTodoList(todos, list)
}

filterBtns.forEach(btn => {
  btn.onclick = (event: MouseEvent) => {
    // Remove selected 
    const selectedEl = document.querySelectorAll('.selected')!
    selectedEl.forEach(el => el.classList.remove('selected'))

    const clickedEl = event.target as HTMLAnchorElement
    clickedEl.classList.add('selected')

    const newTodos = filterTodo(clickedEl.innerText.toLowerCase())
    renderTodoList(newTodos, list)
  }
})

clearBtn.onclick = clearCompletedTodos
