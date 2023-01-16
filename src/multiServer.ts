import http, { IncomingMessage, ServerResponse } from 'http'
import server from './server.js'
import cluster from 'cluster'
import os from 'os'
import db from './db/db.js'
import messages from './messages/messages.js'

const workersNum = os.cpus().length

const availablePorts: number[] = []
let currentPortIndex = 0
let currentPort = 4001

export default async (serverConfig: serverConfig): Promise<void> => {
  if (cluster.isPrimary) {
    console.log('-----------------------------------------------------------')
    console.log(':: MULTI server mode ::')
    console.log(`Master process (db runner) with PID ${process.pid} is listening on port ${serverConfig.port}`)
    console.log(`Actual API URL is: http://${serverConfig.host}:${serverConfig.port}${serverConfig.api}`)
    console.log('-----------------------------------------------------------')

    for (let i = 1; i < workersNum + 1; i++) {
      availablePorts.push(+serverConfig.port + i)
      const worker = cluster.fork({ PORT: +serverConfig.port + i })

      worker.on('message', async (dbRequest) => {
        const { action, args } = dbRequest
        try {
          const response = await db[action](args)
          worker.send(response)
        } catch {
          worker.send({ status: 500, payload: messages.serverError })
        }
      })
    }

    const onRequest = async (clientReq: IncomingMessage, clientRes: ServerResponse): Promise<void> => {
      const options = {
        hostname: serverConfig.host,
        path: clientReq.url,
        method: clientReq.method,
        headers: clientReq.headers
      }

      if (currentPortIndex === availablePorts.length - 1) { currentPortIndex = 0 }

      currentPort = availablePorts[currentPortIndex]
      currentPortIndex++

      const proxy = http.request({ ...options, port: currentPort }, (forkRes) => {
        clientRes.writeHead(forkRes.statusCode ?? 500, forkRes.headers)
        forkRes.pipe(clientRes, { end: true })
      })

      clientReq.pipe(proxy, { end: true })
    }

    http.createServer(onRequest).listen(4000)
  } else {
    (await server(serverConfig, {})).listen(process.env.PORT, () => {
      console.log(`НTTP server with PID ${process.pid} is running on port ${+process.env.PORT}`)
    })
  }
}
