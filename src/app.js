import * as dotenv from 'dotenv'
import http from 'http';
import GET from './methods/get.js';
import POST from './methods/post.js';
import PUT from './methods/put.js';
import DELETE from './methods/delete.js';

dotenv.config()

const config = {
    hostname: '127.0.0.1',
    port: process.env.PORT,
    userRequiredFields: ['username', 'age', 'hobbies'],
    
    messages: {
        userAdded: 'User added',
        userDeleted: 'User deleted',

        noUsers: 'No users :(',
        userNotExists: 'User not exists',
        invalidUserID: 'invalid user ID',
        apiError: 'API error. Check path or something. ¯\\_(ツ)_/¯',
        noReqFields: 'Object not valid. Required field(s) missed. ¯\\_(ツ)_/¯',
    }
}

const db = [
    // { id: 'f02c2850-b2b9-4a6b-b423-416cc7807271', username: 'Ivan Petrov', age: 21, hobbies: ['cycling', 'reading'] },
    // { id: 'd8a6cf89-2f8d-4b86-b17d-458f17e491d0', username: 'Sergey Sidorov', age: 42, hobbies: ['trolling', 'lecturing'] },
    // { id: 'aa70805a-0e88-47b6-929a-7e6a20eada49', username: 'Alina Dmitrieva', age: 26, hobbies: ['cooking', 'eating'] },
]

export default () => {   

    const methods = {
        'GET': (req, res, urlParam) => GET(req, res, db, config, urlParam),
        'POST': (req, res, urlParam) => POST(req, res, db, config, urlParam),
        'PUT': (req, res, urlParam) => PUT(req, res, db, config, urlParam),
        'DELETE': (req, res, urlParam) => DELETE(req, res, db, config, urlParam),
    }

    const server = http.createServer((req, res) => {
        const parsedURL = req.url.split('/').filter(path => path);

        if (parsedURL[0] !== 'api'
            && parsedURL[1] === 'users'
        ) {
            res.statusCode = 404;
            res.end(config.messages.apiError)
        }

        methods[req.method](req, res, parsedURL[2])

    });
    server.listen(config.port, config.hostname);
}