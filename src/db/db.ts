import messages from '../messages/messages.js'
import { v4 as uuidv4, validate as isValidID } from 'uuid'

const db: Db = []
const dbMethods: DbMethods = {

  validateObject: function (body: object) {
    return ['username', 'age', 'hobbies'].every((field) => field in body)
      ? {}
      : { status: 400, payload: messages.noReqFields }
  },
  getAllUsers: function () {
    return { status: 200, payload: db }
  },
  getUserByID: function ({ userID }) {
    if (userID === '') { return this.getAllUsers() }
    if (!isValidID(userID)) { return { status: 400, payload: messages.invalidUserID } }

    const user = db.filter((user: User) => user.id === userID)[0]
    return user !== undefined
      ? { status: 200, payload: user }
      : { status: 404, payload: messages.userNotExists }
  },
  addUser: function ({ body }) {
    const bodyValidationResult = this.validateObject(body)
    if (bodyValidationResult.status === 400) { return bodyValidationResult }
    const newUserWithId = { ...body, id: uuidv4() }
    db.push(newUserWithId)
    return { status: 201, payload: newUserWithId }
  },
  updateUser: function ({ userID, body }) {
    if (!isValidID(userID)) { return { status: 400, payload: messages.invalidUserID } }
    const userToUpdate = this.getUserByID({ userID })
    if (userToUpdate.status === 404) { return userToUpdate }

    const bodyValidationResult = this.validateObject(body)
    if (bodyValidationResult.status === 400) { return bodyValidationResult }

    const userIndex = db.indexOf(userToUpdate.payload)

    const updatedUser = { ...body, id: userID }
    db[userIndex] = updatedUser
    return { status: 200, payload: updatedUser }
  },
  deleteUser: function ({ userID }) {
    if (!isValidID(userID)) { return { status: 400, payload: messages.invalidUserID } }

    const userToDelete = this.getUserByID({ userID })
    if (userToDelete.status === 404) { return userToDelete }

    const userIndex = db.indexOf(userToDelete.payload)
    db.splice(userIndex, 1)
    return { status: 204 }
  }
}

export default dbMethods
