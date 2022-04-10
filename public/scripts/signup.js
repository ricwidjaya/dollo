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
