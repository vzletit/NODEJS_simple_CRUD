import { v4 as uuidv4, validate as isValidID } from 'uuid';

const objIsValid = (userObj, reqFields) => reqFields.every(field => field in userObj)
const getUserByID = (users, userID) => users.filter((user) => user.id === userID)[0];

export default (req, res, db, config, userID = '') => {

    if (userID === '') {
        res.statusCode = 404
        res.end(config.messages.apiError);
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

    let body = '';
    req.on('data', chunk => body += chunk.toString())
    req.on('end', () => {

        const parsedBody = JSON.parse(body);

        if (objIsValid(parsedBody, config.userRequiredFields) === false) {
            res.statusCode = 400;
            res.end(config.messages.noReqFields)
            return;
        }

        const userIndex = db.indexOf(user);
        db[userIndex] = { id: uuidv4(), ...parsedBody };
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(parsedBody, null, 3));
        return;

    })

}
