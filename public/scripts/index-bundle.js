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
  if (json.errors) return json
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

module.exports = {
  checkUserInfo,
  extractFormValues,
  unpackFetchData,
  gqlConfig
}

},{}],2:[function(require,module,exports){
const { unpackFetchData, gqlConfig } = require('./client-helper')

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
  console.log(data)
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

},{"./client-helper":1}]},{},[2]);
