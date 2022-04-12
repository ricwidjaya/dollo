const {
  extractFormValues,
  gqlConfig,
  unpackFetchData
} = require('./client-helper')

const form = document.querySelector('form')

form.addEventListener('submit', async event => {
  event.preventDefault()
  const account = extractFormValues(form)

  // Sign in user
  const res = await fetch('/graphql', {
    ...gqlConfig,
    body: JSON.stringify({
      query: `
        query signIn {
          signIn (email: "${account.email}", password: "${account.password}") {
            token
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

  window.location.reload()
})
