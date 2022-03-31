(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
async function unpackFetchData(result) {
  const json = await result.json()
  return json.data
}

module.exports = { unpackFetchData }

},{}],2:[function(require,module,exports){
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

},{"./client-helper":1}]},{},[2]);
