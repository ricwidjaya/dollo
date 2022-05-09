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
async function getAnnounces(role) {
  const res = await fetch('/graphql', {
    ...gqlConfig,
    body: JSON.stringify({
      query: `
        query getAnnounces {
          announcements(role: "${role}") {
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
