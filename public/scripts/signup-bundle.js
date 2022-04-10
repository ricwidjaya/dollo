(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const token = '1234567'
const bearer = `Bearer ${token}`

const gqlConfig = {
  method: 'POST',
  headers: {
    Authorization: bearer,
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
const {
  extractFormValues,
  checkUserInfo,
  gqlConfig,
  unpackFetchData
} = require('./client-helper')
const form = document.querySelector('form')

form.addEventListener('submit', async event => {
  event.preventDefault()
  const account = extractFormValues(form)
  const result = checkUserInfo(account)

  // Alert the error to user
  if (result.error) {
    window.alert(`${result.location}, ${result.error}`)
    return
  }

  // Create new account
  const res = await fetch('/graphql', {
    ...gqlConfig,
    body: JSON.stringify({
      query: `
        mutation {
          signUp(
            username: "${account.username}", 
            email: "${account.email}", 
            password: "${account.password}", 
            confirmPassword: "${account.confirmPassword}") {
            id
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

  window.location.href = '/signin'
})

},{"./client-helper":1}]},{},[2]);
