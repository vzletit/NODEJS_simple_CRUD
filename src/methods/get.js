import { validate as isValidID } from 'uuid';

const getUserByID = (users, userID) => users.filter((user) => user.id === userID)[0];
const getAllUsers = (users) => users;

export default (req, res, db, config, userID = '') => {

    if (userID === '') {

        const users = getAllUsers(db);

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(users.length > 0
            ? JSON.stringify(getAllUsers(db), null, 3)
            : config.messages.noUsers
            );
            
        return;
    }

    if (isValidID(userID) === false) {
        res.statusCode = 400
        res.end(config.messages.invalidUserID);
        return;
    }

    const user = getUserByID(db, userID);

    if (!user) {
        res.statusCode = 404
        res.end(config.messages.userNotExists);
        return;
    }

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(user, null, 3));
    return;

}
