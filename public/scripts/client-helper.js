const gqlConfig = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}

async function unpackFetchData(res) {
  const json = await res.json()
  if (json.error) return json.error
  return json.data
}

module.exports = { unpackFetchData, gqlConfig }
