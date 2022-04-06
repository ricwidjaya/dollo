(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const gqlConfig = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}

async function unpackFetchData(res) {
  const json = await res.json()
  if (json.error) return json.error
  return json.data
}

module.exports = { unpackFetchData, gqlConfig }

},{}],2:[function(require,module,exports){
const { unpackFetchData, gqlConfig } = require('./client-helper')

renderTodo()
renderDoneList()

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

        const res = await fetch('/graphql', {
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
        const data = await unpackFetchData(res)
        console.log(data.finishTask)
      }

      if (btn.dataset.op === 'delete') {
        btn.parentElement.parentElement.remove()
        const res = await fetch('/graphql', {
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
