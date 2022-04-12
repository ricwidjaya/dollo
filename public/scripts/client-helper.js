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
