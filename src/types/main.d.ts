interface serverConfig {
  api: string
  host: string
  port: string | number
}

type Db = User[]
type DbMethods = Record<string, DbMethod>
type DbMethod = (object) => object
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

type Methods = Record<string, (urlParam = '') => void>
