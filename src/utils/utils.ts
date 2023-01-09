export const objIsValid = (userObj:object, reqFields:Array<string>) => reqFields.every(field => field in userObj)

export const getUserByID = (users: Users, userID:string): User => users.filter((user: any) => user.id === userID)[0];
export const getAllUsers = (users: Users) => users;

