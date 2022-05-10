const {
  renderProfile,
  extractFormValues,
  gqlConfig,
  unpackFetchData
} = require('./client-helper')
const moment = require('moment')

renderProfile()

const form = document.querySelector('form')
const button = document.querySelector('#button')

if (form.id) {
  renderAnnouncement(form)
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

    let { id, title, content, expDate, pin } = extractFormValues(form)

    // Check validation of date
    expDate = new Date(expDate)
    const today = new Date()

    if (today > expDate) {
      window.alert("You can't select past date.")
      return
    }

    const res = await fetch('/graphql', {
      ...gqlConfig,
      body: JSON.stringify({
        query: `
        mutation {
          editAnnouncement(id: ${id}, title: "${title}", content: "${content}", expDate: "${expDate}", pin: ${pin}) {
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

    window.location.href = '/announcements'
  })
} else {
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
      return
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

    window.location.href = '/announcements'
  })
}
async function renderAnnouncement(form) {
  const res = await fetch('/graphql', {
    ...gqlConfig,
    body: JSON.stringify({
      query: `
        query getAnnouncement {
          announcement(id: ${form.id.value}) {
            title
            content
            expDate
            pin
          }
        }
      `
    })
  })

  const data = await unpackFetchData(res)
  const announcement = data.announcement
  form.title.value = announcement.title
  form.content.value = announcement.content

  const date = new Date(Number(announcement.expDate))
  const expDate = moment(date).format('YYYY-MM-DD')
  form.expDate.value = expDate

  form.pin.checked = announcement.pin
}
