import runSingleServer from './singleServer'
import runMultiServer from './multiServer'
import * as dotenv from 'dotenv'

dotenv.config()

const app = () => {
  const host = '127.0.0.1'
  const port = +process.env.PORT ?? 4000
  const mode = process.argv[2]

  if (mode === '--multi') {
    const serverConfig = {
      api: '/api',
      host,
      port
    }

    runMultiServer(serverConfig)
  } else {
    const serverConfig = {
      api: '/api/users',
      host,
      port
    }

    runSingleServer(serverConfig)
  }
}

export default app
