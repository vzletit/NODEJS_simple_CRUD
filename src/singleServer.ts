import server from './server.js'
import cluster from 'cluster'
import db from './db/db.js'

export default (serverConfig: serverConfig): void => {
  if (cluster.isPrimary) {
    console.log(':: SINGLE server mode ::')
    console.log(`DB runner with PID ${process.pid} started`)

    const worker = cluster.fork()

    worker.on('message', (message) => {
      const { action, args } = message
      const response = db[action](args)

      worker.send(response)
    })
  } else {
    server(serverConfig).listen(serverConfig.port, () => {
      console.log(`НTTP server with PID ${process.pid} is running on port ${+serverConfig.port}`)
    })
  }
}
