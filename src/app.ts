import runSingleServer from './singleServer.js'
import runMultiServer from './multiServer.js'
import * as dotenv from 'dotenv'

dotenv.config()

const app = async () => {
  const host = '127.0.0.1'
  const port = +process.env.PORT ?? 4000
  const mode = process.argv[2]

  if (mode === '--multi') {
    const serverConfig = {
      api: '/api',
      host,
      port,
      mode: 'multi'
    }

await runMultiServer(serverConfig)
  } else {
    const serverConfig = {
      api: '/api/users',
      mode: 'single',
      host,
      port
    }

    return await runSingleServer(serverConfig)
  }
}

export default app
