const { renderProfile, unpackFetchData, gqlConfig } = require('./client-helper')

renderProfile()
renderTodo()
renderDoneList()
renderAnnouncements()
addTaskListener()
addAnnounceListener()

// Functions
// Add listener to todo modal
async function addTaskListener() {
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
    const res = await fetch('/graphql', {
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
    const data = await unpackFetchData(res)
    if (data.errors) {
      window.alert(data.errors[0].message)
      taskInput.value = ''
      return
    }
    renderTodo()
    // reset modal input
    taskInput.value = ''
  })
}

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

async function getAnnounces() {
  const res = await fetch('/graphql', {
    ...gqlConfig,
    body: JSON.stringify({
      query: `
        query getAnnounces {
          announcements {
            title
            content
            expDate
            approved
            teamId
            pin
          }
        }
      `
    })
  })
  const data = await unpackFetchData(res)
  return data.announcements
}

async function renderAnnouncements() {
  const announceBox = document.querySelector('#announces')
  const announces = await getAnnounces()
  let announceList = ''
  announces.forEach(announce => {
    announceList += `
      <div class="announce-list mb-2">
        <h6 class='card-subtitle text-muted'>
        ${
          announce.pin
            ? `<i class="fa-solid fa-thumbtack card-icon me-2 pin"></i>`
            : ''
        }${announce.title}</h6>
        <p class='card-text'>${announce.content}</p>
      </div>
    `
  })
  announceBox.innerHTML = announceList
}

async function addAnnounceListener() {
  const titleInput = document.querySelector('#announce-title')
  const contentInput = document.querySelector('#announce-content')
  const announceBtn = document.querySelector('#announceBtn')

  // Let user trigger click through "enter"
  titleInput.addEventListener('keyup', event => {
    if (event.keyCode === 13) {
      announceBtn.click()
    }
  })

  contentInput.addEventListener('keyup', event => {
    if (event.keyCode === 13) {
      announceBtn.click()
    }
  })

  announceBtn.addEventListener('click', async event => {
    event.stopPropagation()

    if (!titleInput.value.trim() || !contentInput.value.trim()) {
      window.alert('Please fill the form.')
      return
    }

    const res = await fetch('/graphql', {
      ...gqlConfig,
      body: JSON.stringify({
        query: `
        mutation {
          addAnnouncement(title: "${titleInput.value}", content: "${contentInput.value}") {
            id
            title
            content
            expDate
            approved
          }
        }
        `
      })
    })

    const data = await unpackFetchData(res)

    if (data.errors) {
      window.alert(data.errors[0].message)
      titleInput.value = ''
      contentInput.value = ''
      return
    }
    renderAnnouncements()
    // reset modal input
    titleInput.value = ''
    contentInput.value = ''
  })
}

module.exports = { renderProfile }
