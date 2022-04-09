console.log('signup')
const form = document.querySelector('form')

form.addEventListener('submit', async event => {
  event.preventDefault()
  console.log(form.elements['username'])
})
