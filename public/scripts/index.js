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