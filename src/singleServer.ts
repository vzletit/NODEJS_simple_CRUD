import server from './server.js'
import dbMethods from './db/db.js'

export default async (serverConfig: serverConfig) => (await server(serverConfig, dbMethods))
  .listen(
    serverConfig.port,
    serverConfig.host,
    () => {
      console.log(`-----------------------------------------------------------`)
      console.log(`НTTP server is running in single mode`)
      console.log(`Actual API URL is: http://${serverConfig.host}:${serverConfig.port}${serverConfig.api}`)
      console.log(`-----------------------------------------------------------`)
    })
