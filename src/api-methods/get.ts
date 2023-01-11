import { IncomingMessage } from 'http'
import { validate as isValidID } from 'uuid'
import { getUserByID, getAllUsers } from '../utils/utils.js'

export default (req: IncomingMessage, res: Res, db: Users, config: Config, userID = ''): void => {
  if (userID === '') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(getAllUsers(db), null, 3))

    return
  }

  if (!isValidID(userID)) {
    res.statusCode = 400
    res.end(config.messages.invalidUserID)
    return
  }

  const user = getUserByID(db, userID)

  if (user === undefined) {
    res.statusCode = 404
    res.end(config.messages.userNotExists)
    return
  }

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(user, null, 3))
}
