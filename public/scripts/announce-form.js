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
