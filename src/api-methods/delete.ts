import { validate as isValidID } from 'uuid';
import {getUserByID} from '../utils/utils.js';

export default (req: Req, res: Res, db: Users, config: Config, userID = '') => {

    if (userID === '') {
        res.statusCode = 404
        res.end(config.messages.apiError)
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

    const userIndex = db.indexOf(user)
    db.splice(userIndex, 1)
    res.statusCode = 204
    res.end(config.messages.userDeleted);
    return;
}
