(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const {
  renderProfile,
  extractFormValues,
  gqlConfig,
  unpackFetchData
} = require('./client-helper')

renderProfile()

const form = document.querySelector('form')
const button = document.querySelector('#button')

button.addEventListener('click', async event => {
  event.preventDefault()

  // Check if user fill out the form
  if (
    !form.title.value.trim() ||
    !form.content.value.trim() ||
    !form.expDate.value
  ) {
    window.alert('Please fill out the form and select a expiration date.')
    return
  }

  let { title, content, expDate, pin } = extractFormValues(form)

  // Check validation of date
  expDate = new Date(expDate)
  const today = new Date()

  if (today > expDate) {
    window.alert("You can't select past date.")
  }

  const res = await fetch('/graphql', {
    ...gqlConfig,
    body: JSON.stringify({
      query: `
        mutation {
          adminAnnounce(title: "${title}", content: "${content}", expDate: "${expDate}", pin: ${pin}) {
          id
          title
          content
        } 
      }
      `
    })
  })

  const data = await unpackFetchData(res)

  if (data.errors) {
    window.alert(data.errors[0].message)
    return
  }

  window.location.href = '/'
})

},{"./client-helper":2}],2:[function(require,module,exports){
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

module.exports = {
  renderProfile,
  checkUserInfo,
  extractFormValues,
  unpackFetchData,
  gqlConfig
}

},{}]},{},[1]);
