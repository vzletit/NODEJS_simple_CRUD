export const objIsValid = (userObj, reqFields) => reqFields.every(field => field in userObj);
export const getUserByID = (users, userID) => users.filter((user) => user.id === userID)[0];
export const getAllUsers = (users) => users;
//# sourceMappingURL=utils.js.map