import * as dotenv from 'dotenv'
import http, { IncomingMessage, ServerResponse } from 'http'
import GET from './api-methods/get.js'
import POST from './api-methods/post.js'
import PUT from './api-methods/put.js'
import DELETE from './api-methods/delete.js'

dotenv.config()

const config: Config = {
  port: process.env.PORT ?? '3000',
  userRequiredFields: ['username', 'age', 'hobbies'],

  messages: {
    userAdded: 'User added',
    userDeleted: 'User deleted',

    serverError: 'Server error (not yours)',
    userNotExists: 'User not exists',
    invalidUserID: 'invalid user ID',
    apiError: 'API error. Check path or something. ¯\\_(ツ)_/¯',
    noReqFields: 'Object not valid. Required field(s) missed. ¯\\_(ツ)_/¯'
  }
}

const db: Users = [
  //   { id: 'f02c2850-b2b9-4a6b-b423-416cc7807271', username: 'Ivan Petrov', age: 21, hobbies: ['cycling', 'reading'] },
  //   { id: 'd8a6cf89-2f8d-4b86-b17d-458f17e491d0', username: 'Sergey Sidorov', age: 42, hobbies: ['trolling', 'lecturing'] },
  //   { id: 'aa70805a-0e88-47b6-929a-7e6a20eada49', username: 'Alina Dmitrieva', age: 26, hobbies: ['cooking', 'eating'] },
]

export default (): void => {
  const methods: Methods = {
    GET: (req: IncomingMessage, res: ServerResponse, urlParam = ''): void => { GET(req, res, db, config, urlParam) },
    POST: (req: IncomingMessage, res: ServerResponse, urlParam = ''): void => { POST(req, res, db, config, urlParam) },
    PUT: (req: IncomingMessage, res: ServerResponse, urlParam = ''): void => { PUT(req, res, db, config, urlParam) },
    DELETE: (req: IncomingMessage, res: ServerResponse, urlParam = ''): void => { DELETE(req, res, db, config, urlParam) }
  }

  const server = http.createServer((req, res) => {
    const userInputUrl: string = req.url ?? ''
    const parsedURL: string[] = userInputUrl.split('/').filter((path: string) => path)

    if (parsedURL[0] !== 'api' && parsedURL[1] === 'users') {
      res.statusCode = 404
      res.end(config.messages.apiError)
    }

    try {
      methods[req.method as keyof Methods](req, res, parsedURL[2])
    } catch {
      res.statusCode = 500
      res.end(config.messages.serverError)
    }
  })
  server.listen(config.port)
}
