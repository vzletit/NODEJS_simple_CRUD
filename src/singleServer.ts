import server from './server'
import cluster from 'cluster'
import db from './db/db'
import messages from './messages/messages'

export default (serverConfig: serverConfig): void => {
  if (cluster.isPrimary) {
    console.log(':: SINGLE server mode ::')
    console.log(`DB runner with PID ${process.pid} started`)

    const worker = cluster.fork()

    worker.on('message', (dbRequest) => {
      const { action, args } = dbRequest
      try {
        const response = db[action](args)
        worker.send(response)
      } catch {
        worker.send({ status: 500, payload: messages.serverError })
      }
    })
  } else {
    server(serverConfig).listen(serverConfig.port, () => {
      console.log(`НTTP server with PID ${process.pid} is running on port ${+serverConfig.port}`)
    })
  }
}
