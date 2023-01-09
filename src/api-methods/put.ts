import { validate as isValidID } from 'uuid';
import {objIsValid, getUserByID} from '../utils/utils.js';

export default (req: Req, res: Res, db: Users, config: Config, userID = '') => {

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
    req.on('data', (chunk: Buffer) => body += chunk.toString())
    req.on('end', () => {

        const parsedBody = JSON.parse(body);

        if (objIsValid(parsedBody, config.userRequiredFields) === false) {
            res.statusCode = 400;
            res.end(config.messages.noReqFields)
            return;
        }
        
        const originalId = user.id;
        const userIndex = db.indexOf(user);
        const updatedUser = { ...parsedBody, id: originalId }
        db[userIndex] = updatedUser;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(updatedUser, null, 3));
        return;

    })

}
