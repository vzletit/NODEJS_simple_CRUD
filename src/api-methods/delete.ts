import { validate as isValidID } from 'uuid'
import { IncomingMessage } from 'http'
import { getUserByID } from '../utils/utils.js'

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

  const userIndex = db.indexOf(user)
  db.splice(userIndex, 1)
  res.statusCode = 204
  res.end(config.messages.userDeleted)
}
