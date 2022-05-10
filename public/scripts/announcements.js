const {
  renderProfile,
  getAnnounces,
  gqlConfig,
  unpackFetchData
} = require('./client-helper')
const moment = require('moment')

renderProfile()
renderPage()

// Functions
async function renderPage() {
  await renderAnnouncements()
  addDeleteListener()
  addApproveListener()
  addPinListener()
}

async function renderAnnouncements() {
  const announcements = await getAnnounces('manager')
  const cards = document.querySelector('#cards')
  let rawHTML = ''
  announcements.forEach(announcement => {
    // Format the date
    const date = new Date(Number(announcement.expDate))

    const endDate = moment(date).format('YYYY-MM-DD')

    const announceContent = `
      <div id='${announcement.id}' class='card ${
      announcement.approved ? '' : 'unapproved'
    }' style='width: 18rem;'>
        <div class='card-body'>
          <div class="d-flex">
            <h5 class='card-title'>${announcement.title}</h5>
            <a class="btn pin ${announcement.pin ? '' : 'unpin'}"data-id="${
      announcement.id
    }"><i class="fa-solid fa-thumbtack card-icon me-2" data-id="${
      announcement.id
    }"></i></a>
          </div>
          <small>End On: ${endDate}</small>
          <h6 class='card-subtitle mb-2 text-muted'>${announcement.content}</h6>
          <div class='text-end mx-3'>
          ${
            announcement.approved
              ? ''
              : `<a class='btn approve-btn' data-id="${announcement.id}"><i class='fa-solid fa-check card-icon' data-id="${announcement.id}"></i></a>`
          }
            <a href="/announcements/${
              announcement.id
            }/edit" class='btn'><i class='fa-solid fa-pen-to-square card-icon'></i></a>
            <a class='btn eraser' data-id="${
              announcement.id
            }"><i class='fa-solid fa-eraser card-icon' data-id="${
      announcement.id
    }"></i></a>
          </div>
        </div>
      </div>
    `
    rawHTML += announceContent
  })
  cards.innerHTML = rawHTML
}

async function addDeleteListener() {
  const deleteBtns = document.querySelectorAll('.eraser')
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', async event => {
      const id = event.target.dataset.id
      const card = document.getElementById(id)

      const res = await fetch('/graphql', {
        ...gqlConfig,
        body: JSON.stringify({
          query: `
            mutation {
              deleteAnnouncement(id: ${id}) {
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

      card.remove()
    })
  })
}

async function addApproveListener() {
  const approveBtns = document.querySelectorAll('.approve-btn')
  if (!approveBtns) return

  approveBtns.forEach(btn => {
    btn.addEventListener('click', async event => {
      const id = event.target.dataset.id
      const res = await fetch('/graphql', {
        ...gqlConfig,
        body: JSON.stringify({
          query: `
            mutation {
              approveAnnouncement(id: ${id}) {
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

      // Change style and remove check icon
      const card = document.getElementById(id)
      card.classList.remove('unapproved')
      event.target.remove()
    })
  })
}

async function addPinListener() {
  const pinBtns = document.querySelectorAll('.pin')

  pinBtns.forEach(btn => {
    btn.addEventListener('click', async event => {
      const id = event.target.dataset.id
      const res = await fetch('/graphql', {
        ...gqlConfig,
        body: JSON.stringify({
          query: `
            mutation {
              togglePin(id: ${id}) {
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

      // Toggle pin style
      btn.classList.toggle('unpin')
    })
  })
}
