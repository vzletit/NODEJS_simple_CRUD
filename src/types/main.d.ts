type Users = User[]

interface Res {
  statusCode: number
  setHeader: Function
  end: Function
}

interface User {
  id: string
  username: string
  age: number
  hobbies?: string[]
}

interface Config {
  port: string
  userRequiredFields: array<string>
  messages: Record<string, string>
}

type Methods = Record<string, (req: IncomingMessage, res: ServerResponse, urlParam = '') => void>
