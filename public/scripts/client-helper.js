const token = '1234567'
const bearer = `Bearer ${token}`

const gqlConfig = {
  method: 'POST',
  headers: {
    Authorization: bearer,
    'Content-Type': 'application/json'
  }
}

async function unpackFetchData(res) {
  const json = await res.json()
  if (json.error) return json.error
  return json.data
}

module.exports = { unpackFetchData, gqlConfig }
