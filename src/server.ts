
import http from 'http'
import messages from './messages/messages.js'

const isJsonValid = (str: string) => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

const runServer = (serverConfig: any) => http.createServer((req, res) => {
  const sendError = (statusCode: number, message: string) => {
    res.statusCode = statusCode
    res.end(message)
    console.log(`Error sent by server with pid#${process.pid} running on port ${+process.env.PORT}`)
  }

  res.setHeader('Content-Type', 'application/json')

  const methods: Methods = {

    GET: (urlParam = '') => {
      process.send({ action: 'getUserByID', args: { userID: urlParam } })
    },

    POST: (urlParam = '') => {
      if (urlParam !== '') {
        sendError(400, messages.apiError)
        return
      }

      const buffers: Buffer[] = []
      req.on('data', (chunk: Buffer) => (buffers.push(chunk)))
      req.on('end', () => {
        const serializedData = Buffer.concat(buffers).toString()

        if (!isJsonValid(serializedData)) {
          sendError(400, messages.jsonError)
        } else { process.send({ action: 'addUser', args: { body: JSON.parse(serializedData) } }) }
      })
    },

    PUT: (urlParam = '') => {
      const buffers: Buffer[] = []
      req.on('data', (chunk: Buffer) => (buffers.push(chunk)))
      req.on('end', () => {
        const serializedData = Buffer.concat(buffers).toString()

        if (!isJsonValid(serializedData)) {
          sendError(400, messages.jsonError)
        } else {
          process.send({ action: 'updateUser', args: { userID: urlParam, body: JSON.parse(serializedData) } })
        }
      })
    },

    DELETE: (urlParam = '') => { process.send({ action: 'deleteUser', args: { userID: urlParam } }) }
  }

  const userInputUrl: string = req.url ?? ''

  if (userInputUrl !== serverConfig.api && !userInputUrl.startsWith(serverConfig.api + '/')) {
    sendError(404, messages.apiError)
    return
  }

  const urlParam = userInputUrl.slice(+serverConfig.api.length + 1)

  methods[req.method ?? 'GET'](urlParam)

  try {
    process.on('message', (dbResponse: DbResponse) => {
      console.log(`Response sent by server with pid#${process.pid} running on port ${+process.env.PORT}`)

      res.statusCode = dbResponse.status
      res.end(JSON.stringify(dbResponse.payload, null, 1))
      process.removeAllListeners()
    })
  } catch {
    res.statusCode = 500
    res.end(messages.serverError)
  }
})

export default runServer
