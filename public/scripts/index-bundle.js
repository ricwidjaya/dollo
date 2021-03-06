(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const gqlConfig = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}

// Clean response data from GraphQL API
async function unpackFetchData(res) {
  const json = await res.json()
  if (json.errors) {
    return json
  }
  return json.data
}

// "form" refers to form in DOM element
function extractFormValues(form) {
  const inputValues = {}
  for (let i = 0; i < form.elements.length; i++) {
    const element = form.elements.item(i)
    if (element.tagName === 'INPUT') {
      inputValues[element.name] = element.value
    }

    // Checkbox return boolean
    if (element.type === 'checkbox') {
      inputValues[element.name] = element.checked
    }
  }
  return inputValues
}

// "account" refers to an object which contains user information
function checkUserInfo(account) {
  // Check validity for each user info
  for (let key in account) {
    if (!account[key] || account[key].trim() === '') {
      return {
        location: `error in ${key} filed`,
        error: 'All fields must be filled!'
      }
    }
    if (key === 'confirmPassword') {
      if (account['confirmPassword'] !== account['password']) {
        return {
          location: `error in ${key} filed`,
          error: "Password doesn't match."
        }
      }
    }
  }
  return {
    result: 'success',
    error: null
  }
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
            role
          }
        }
      `
    })
  })
  const data = await unpackFetchData(res)
  return data.me
}

// Render personal info
async function renderProfile() {
  const avatar = document.querySelector('#avatar')
  const name = document.querySelector('#name')
  const user = await getMyInfo()
  avatar.src = user.avatar
  if (name) {
    name.innerHTML = user.username
  }
}

// Get announcements
async function getAnnounces(role, archived = false) {
  const res = await fetch('/graphql', {
    ...gqlConfig,
    body: JSON.stringify({
      query: `
        query getAnnounces {
          announcements(role: "${role}", archived: ${archived}) {
            id
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

module.exports = {
  renderProfile,
  getAnnounces,
  checkUserInfo,
  extractFormValues,
  unpackFetchData,
  gqlConfig
}

},{}],2:[function(require,module,exports){
const {
  renderProfile,
  unpackFetchData,
  gqlConfig,
  getAnnounces
} = require('./client-helper')

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

async function renderAnnouncements() {
  const announceBox = document.querySelector('#announces')
  const announces = await getAnnounces('member')
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

},{"./client-helper":1}]},{},[2]);
