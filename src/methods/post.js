import { v4 as uuidv4 } from 'uuid';

const objIsValid = (userObj, reqFields) => reqFields.every(field => field in userObj)

export default (req, res, db, config, excessParam = '') => {
 
    if (excessParam) {
        res.statusCode = 404;
        res.end(config.messages.apiError);
    }
    
    let body = '';
    req.on('data', chunk => body += chunk.toString())
    req.on('end', () => {

        const parsedBody = JSON.parse(body);

        if (!objIsValid(parsedBody, config.userRequiredFields)) {
            res.statusCode = 400;
            res.end(config.messages.noReqFields)
            return;
        }

        db.push({ id: uuidv4(), ...parsedBody })
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(parsedBody, null, 3));
        return;
    })

}