import { validate as isValidID } from 'uuid'
import { IncomingMessage } from 'http'
import { objIsValid, getUserByID } from '../utils/utils.js'

export default (req: IncomingMessage, res: Res, db: Users, config: Config, userID = ''): void => {
  if (userID === '') {
    res.statusCode = 404
    res.end(config.messages.apiError)
    return
  }

  if (!isValidID(userID)) {
    res.statusCode = 400
    res.end(config.messages.invalidUserID)
    return
  }

  const user = getUserByID(db, userID)

  if (user == null) {
    res.statusCode = 404
    res.end(config.messages.userNotExists)
    return
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

    const originalId = user.id
    const userIndex = db.indexOf(user)
    const updatedUser = { ...parsedBody, id: originalId }
    db[userIndex] = updatedUser
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(updatedUser, null, 3))
  })
}
