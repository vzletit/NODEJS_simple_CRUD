interface serverConfig {
  api: string
  host: string
  port: number
}

type Db = User[]
type DbMethods = Record<string, DbMethod>
type DbMethod = (args: DbPayload) => DbResponse | {}

interface DbPayload {
  userID?: string
  body?: User
}

interface DbRequest {
  action: string
  args?: DbPayload
}

interface DbResponse {
  status: number
  payload: string | object
}

interface User {
  id?: string
  username: string
  age: number
  hobbies: string[]
}

type Methods = Record<string, (urlParam: string) => void>
