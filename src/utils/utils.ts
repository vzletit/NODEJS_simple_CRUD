export const objIsValid = (userObj: object, reqFields: string[]): boolean =>
  reqFields.every((field) => field in userObj)

export const getUserByID = (users: Users, userID: string): User | undefined =>
  users.filter((user: any) => user.id === userID)[0]

export const getAllUsers = (users: Users): Users => users
