import http from 'http'
import messages from './messages/messages.js'

const isJsonValid = (str: string) => {
  let parsed: User;
  try {
    parsed = JSON.parse(str)
  } catch (e) {
    return false
  }

  return true
}

const runServer = async (serverConfig: serverConfig, dbMethods: DbMethods) => http.createServer( async (req, res) => {
  const sendError = (statusCode: number, message: string) => {
    res.statusCode = statusCode
    res.end(message)
  }

  const processReqByMode = async (dbReq: DbRequest) => {
    res.setHeader('Content-Type', 'application/json')
    if (serverConfig.mode === 'single' && dbMethods !== undefined) {
      try {
        const { status, payload } = await dbMethods[dbReq.action](dbReq.args)
        res.statusCode = status
        res.end(JSON.stringify(payload))
      } catch (e) {
        res.statusCode = 500
        res.end(messages.serverError)
      }
    } else {
      process.send(dbReq)
    }
  }

  const methods: Methods = {

    GET: async (urlParam = '') => {
      await processReqByMode({ action: 'getUserByID', args: { userID: urlParam } })
    },

    POST: async (urlParam = '') => {
      if (urlParam !== '') {
        sendError(400, messages.apiError)
        return
      }

      const buffers: Buffer[] = []
      req.on('data', (chunk: Buffer) => (buffers.push(chunk)))
      req.on('end', async () => {
        const serializedData = Buffer.concat(buffers).toString()

        if (!isJsonValid(serializedData)) {
          sendError(500, messages.jsonError)
          return
        } else { await processReqByMode({ action: 'addUser', args: { body: JSON.parse(serializedData) } }) }
      })
    },

    PUT: async (urlParam = '') => {
      const buffers: Buffer[] = []
      req.on('data', (chunk: Buffer) => (buffers.push(chunk)))
      req.on('end', async () => {
        const serializedData = Buffer.concat(buffers).toString()

        if (!isJsonValid(serializedData)) {
          sendError(500, messages.jsonError)
        } else {
          await processReqByMode({ action: 'updateUser', args: { userID: urlParam, body: JSON.parse(serializedData) } })
        }
      })
    },

    DELETE: async (urlParam = '') => { await processReqByMode({ action: 'deleteUser', args: { userID: urlParam } }) }
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
