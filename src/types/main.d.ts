type Users = Array<User>;

type Req = {
    on: Function;
}

type Res = {
    statusCode: number;
    setHeader: Function;
    end: Function;
}

type User = {
    id: string;
    username: string;
    age: number;
    hobbies?: Array<string>;
}

type Config = {    
    port: string;
    userRequiredFields: array<string>;
    messages: { [key: string]: string;        
    }
}