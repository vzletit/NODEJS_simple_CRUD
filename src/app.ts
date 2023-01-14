import runSingleServer from './singleServer.js'
import runMultiServer from './multiServer.js'
import * as dotenv from 'dotenv'

dotenv.config()

if (process.env.PORT === undefined) {
  console.log('-----------------------------------------------------------------------------')
  console.log('!!!! PORT is not defined. Please rename ".env-example" to ".env" and restart.')
  console.log('-----------------------------------------------------------------------------')
  console.log('')
  process.exit(0)
}

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
