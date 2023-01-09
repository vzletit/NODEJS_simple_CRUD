import * as dotenv from 'dotenv'
import http, {IncomingMessage, ServerResponse} from 'http';
import GET from './api-methods/get.js';
import POST from './api-methods/post.js';
import PUT from './api-methods/put.js';
import DELETE from './api-methods/delete.js';

dotenv.config()

const config: Config = {    
    port: process.env.PORT || '3000',
    userRequiredFields: ['username', 'age', 'hobbies'],
    
    messages: {
        userAdded: 'User added',
        userDeleted: 'User deleted',

        userNotExists: 'User not exists',
        invalidUserID: 'invalid user ID',
        apiError: 'API error. Check path or something. ¯\\_(ツ)_/¯',
        noReqFields: 'Object not valid. Required field(s) missed. ¯\\_(ツ)_/¯',
    }
}

const db: Users = [
    // { id: 'f02c2850-b2b9-4a6b-b423-416cc7807271', username: 'Ivan Petrov', age: 21, hobbies: ['cycling', 'reading'] },
    // { id: 'd8a6cf89-2f8d-4b86-b17d-458f17e491d0', username: 'Sergey Sidorov', age: 42, hobbies: ['trolling', 'lecturing'] },
    // { id: 'aa70805a-0e88-47b6-929a-7e6a20eada49', username: 'Alina Dmitrieva', age: 26, hobbies: ['cooking', 'eating'] },
]

export default () => {   
      
    const methods: any = {
        'GET':  (req: Req, res: Res, urlParam?: string) => GET(req, res, db, config, urlParam),
        'POST': (req: Req, res: Res, urlParam?: string) => POST(req, res, db, config, urlParam),
        'PUT': (req: Req, res: Res, urlParam?: string) => PUT(req, res, db, config, urlParam),
        'DELETE': (req: Req, res: Res, urlParam?: string) => DELETE(req, res, db, config, urlParam),
    }

    const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
        const parsedURL: Array<string> = req.url!.split('/').filter(path => path);

        if (parsedURL[0] !== 'api'
            && parsedURL[1] === 'users'
        ) {
            res.statusCode = 404;
            res.end(config.messages.apiError)
        }

        if (req.method !== undefined) { methods[req.method](req, res, parsedURL[2]) }        

    });
    server.listen(config.port);
}