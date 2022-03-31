async function unpackFetchData(result) {
  const json = await result.json()
  return json.data
}

module.exports = { unpackFetchData }
