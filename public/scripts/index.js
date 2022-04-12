const { unpackFetchData, gqlConfig } = require('./client-helper')

getMyInfo()
renderTodo()
renderDoneList()

// Add listener to todo modal
const taskInput = document.querySelector('#task-name')
const addBtn = document.querySelector('#addBtn')

// Let user trigger click through "enter"
taskInput.addEventListener('keyup', event => {
  if (event.keyCode === 13) {
    addBtn.click()
  }
})

addBtn.addEventListener('click', async event => {
  event.stopPropagation()
  if (!taskInput.value.trim()) {
    // Replace it with sweetAlert
    window.alert('Please enter your task.')
    return
  }
  await fetch('/graphql', {
    ...gqlConfig,
    body: JSON.stringify({
      query: `
        mutation {
          addTask(name: "${taskInput.value}") {
            id
            name
          }
        }
      `
    })
  })
  renderTodo()
  // reset modal input
  taskInput.value = ''
})

// Functions
// Render Todo List
async function renderTodo() {
  const todoBox = document.querySelector('#todos')
  const tasks = await getTasks(false)
  let tasksList = ''
  tasks.forEach(task => {
    tasksList += `
    <div class="todo-list d-flex justify-content-between align-items-center">
    <h6 class='card-subtitle'>${task.name}</h6>
    <div class="todo-operation d-flex justify-content-end">
    <a class="btn btn-op" data-op="check" data-task-id="${task.id}"><i class="fa-regular fa-circle-check"></i></a>
    <a class="btn btn-op" data-op="delete" data-task-id="${task.id}"><i class="fa-regular fa-circle-xmark"></i></a>
    </div>
    </div>
    `
  })
  todoBox.innerHTML = tasksList
  addTodoListener()
}

// Render done list
async function renderDoneList() {
  const doneBox = document.querySelector('#done-tasks')
  const doneTasks = await getTasks(true)
  let taskList = ''
  doneTasks.forEach(task => {
    taskList += `
      <div class="todo-list d-flex justify-content-between align-items-center">
        <h6 class='card-subtitle'>${task.name}</h6>
        <div class="todo-operation d-flex justify-content-end">
          <a class="btn btn-op" data-task-id="${task.id}" data-op="delete"><i class="fa-regular fa-circle-xmark"></i></a>
        </div>
      </div>
    `
  })
  doneBox.innerHTML = taskList

  // After all tasks are rendered, add event listeners to them for CRUD ops
  addTodoListener()
}

async function getTasks(done) {
  const res = await fetch('/graphql', {
    ...gqlConfig,
    body: JSON.stringify({
      query: `
      query getTasks {
        tasks(done: ${done}) {
          id
          userId
          name
          done
        }
      }
      `
    })
  })
  const data = await unpackFetchData(res)
  return data.tasks
}

function addTodoListener() {
  const todoBtns = document.querySelectorAll('.btn-op')

  todoBtns.forEach(btn => {
    btn.addEventListener('click', async event => {
      event.preventDefault()
      event.stopPropagation()
      const id = btn.dataset.taskId

      // Check operation
      if (btn.dataset.op === 'check') {
        btn.parentElement.parentElement.remove()

        await fetch('/graphql', {
          ...gqlConfig,
          body: JSON.stringify({
            query: `
              mutation {
                finishTask(id: ${id}) {
                  id
                  name
                  done
                }
              }
            `
          })
        })
        renderDoneList()
      }

      if (btn.dataset.op === 'delete') {
        btn.parentElement.parentElement.remove()
        await fetch('/graphql', {
          ...gqlConfig,
          body: JSON.stringify({
            query: `
              mutation {
                deleteTask(id: ${id}) {
                  id
                  name
                  done
                }
              }
            `
          })
        })
      }
    })
  })
}

async function getMyInfo() {
  const res = await fetch('/graphql', {
    ...gqlConfig,
    body: JSON.stringify({
      query: `
        query getMyInfo {
          me {
            id
            username
            email
            avatar
          }
        }
      `
    })
  })
  const data = await unpackFetchData(res)
  console.log(data)
}
