const { renderProfile, getAnnounces } = require('./client-helper')
const moment = require('moment')

renderProfile()
renderAnnouncements()

// Functions
async function renderAnnouncements() {
  const announcements = await getAnnounces('manager')
  const cards = document.querySelector('#cards')
  let rawHTML = ''
  announcements.forEach(announcement => {
    // Format the date
    const date = new Date(Number(announcement.expDate))

    const endDate = moment(date).format('YYYY-MM-DD')

    const announceContent = `
      <div class='card ${
        announcement.approved ? '' : 'unapproved'
      }' style='width: 18rem;'>
        <div class='card-body'>
          <h5 class='card-title'>${announcement.title}</h5>
          <small>End On: ${endDate}</small>
          <h6 class='card-subtitle mb-2 text-muted'>${announcement.content}</h6>
          <div class='text-end mx-3'>
          ${
            announcement.approved
              ? ''
              : "<a class='btn'><i class='fa-solid fa-check card-icon'></i></a>"
          }
            <a class='btn'><i class='fa-solid fa-pen-to-square card-icon'></i></a>
            <a class='btn'><i class='fa-solid fa-eraser eraser card-icon'></i></a>
          </div>
        </div>
      </div>
    `
    rawHTML += announceContent
  })
  cards.innerHTML = rawHTML
}
