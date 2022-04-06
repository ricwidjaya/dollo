(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const gqlConfig = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}

async function unpackFetchData(result) {
  const json = await result.json()
  return json.data
}

module.exports = { unpackFetchData, gqlConfig }

},{}],2:[function(require,module,exports){
const { unpackFetchData, gqlConfig } = require('./client-helper')


renderTodo()



// Functions
async function getTasks() {
  const result = await fetch('/graphql', {
    ...gqlConfig,
    body: JSON.stringify({
      query: `
      query getTasks {
        tasks {
          id
          userId
          name
          done
        }
      }
      `
    })
  })
  const data = await unpackFetchData(result)
  return data.tasks
}

// Render Todo List
const renderTodo = async () => {
  const todoBox = document.querySelector('#todos')
  const tasks = await getTasks()
  let tasksList = ''
  tasks.forEach(task => {
    tasksList += `
      <div class="todo-list d-flex justify-content-between align-items-center">
        <h6 class='card-subtitle'>${task.name}</h6>
        <div class="todo-operation d-flex justify-content-end">
          <a class="btn btn-op" href="#"><i class="fa-regular fa-circle-check"></i></a>
          <a class="btn btn-op" href="#"><i class="fa-regular fa-circle-xmark"></i></a>
        </div>
      </div>
    `
  })
  todoBox.innerHTML = tasksList
}
},{"./client-helper":1}]},{},[2]);
