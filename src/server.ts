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

const runServer = (serverConfig: serverConfig, dbMethods: DbMethods) => http.createServer((req, res) => {
  const sendError = (statusCode: number, message: string) => {
    res.statusCode = statusCode
    res.end(message)
  }

  const processReqByMode = (dbReq: DbRequest) => {
    res.setHeader('Content-Type', 'application/json')
    if (serverConfig.mode === 'single' && dbMethods !== undefined) {
      const { status, payload } = dbMethods[dbReq.action](dbReq.args)
      res.statusCode = status
      res.end(JSON.stringify(payload))
    } else {
      process.send(dbReq)
    }
  }

  const methods: Methods = {

    GET: (urlParam = '') => {
      processReqByMode({ action: 'getUserByID', args: { userID: urlParam } })
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
          sendError(500, messages.jsonError)
        } else { processReqByMode({ action: 'addUser', args: { body: JSON.parse(serializedData) } }) }
      })
    },

    PUT: (urlParam = '') => {
      const buffers: Buffer[] = []
      req.on('data', (chunk: Buffer) => (buffers.push(chunk)))
      req.on('end', () => {
        const serializedData = Buffer.concat(buffers).toString()

        if (!isJsonValid(serializedData)) {
          sendError(500, messages.jsonError)
        } else {
          processReqByMode({ action: 'updateUser', args: { userID: urlParam, body: JSON.parse(serializedData) } })
        }
      })
    },

    DELETE: (urlParam = '') => { processReqByMode({ action: 'deleteUser', args: { userID: urlParam } }) }
  }

  const userInputUrl: string = req.url ?? ''

  if (userInputUrl !== serverConfig.api && !userInputUrl.startsWith(serverConfig.api + '/')) {
    sendError(404, messages.apiError)
    return
  }

  const urlParam = userInputUrl.slice(+serverConfig.api.length + 1)

  methods[req.method ?? 'GET'](urlParam)

  try {
    const giveResponse = (dbResponse: DbResponse) => {
      if (serverConfig.mode !== 'single') { console.log(`Response from server pid #${process.pid} / port ${+process.env.PORT}`) }

      res.statusCode = dbResponse.status
      res.end(JSON.stringify(dbResponse.payload, null, 1))
    }
    process.on('message', giveResponse)

    setTimeout(() => { process.removeListener('message', giveResponse) }, 1000)
  } catch {
    res.statusCode = 500
    res.end(messages.serverError)
  }
})

export default runServer
