import { v4 as uuidv4 } from 'uuid'
import { IncomingMessage, ServerResponse } from 'http'
import { objIsValid } from '../utils/utils.js'

export default (
  req: IncomingMessage,
  res: ServerResponse,
  db: Users,
  config: Config,
  excessParam = ''
): void => {
  if (excessParam !== '') {
    res.statusCode = 404
    res.end(config.messages.apiError)
  }

  let body = ''
  req.on('data', (chunk: Buffer) => (body += chunk.toString()))
  req.on('end', () => {
    const parsedBody = JSON.parse(body)

    if (!objIsValid(parsedBody, config.userRequiredFields)) {
      res.statusCode = 400
      res.end(config.messages.noReqFields)
      return
    }

    const newUser = { ...parsedBody, id: uuidv4() }

    db.push(newUser)
    res.statusCode = 201
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(newUser, null, 3))
  })
}
