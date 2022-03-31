const { unpackFetchData } = require('./client-helper')

const getUser = async () => {
  const result = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
      query getUsers {
        users {
          id
          title
        }
      }
      `
    })
  })

  const data = await unpackFetchData(result)
  console.log(data.users)
}

getUser()
