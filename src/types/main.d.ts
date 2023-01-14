interface serverConfig {
  api: string
  mode: string
  host?: string
  port?: number

}

type Db = User[]
type DbMethods = Record<string, DbMethod> | undefined
type DbMethod = (args: DbPayload) => DbResponse

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
