/* eslint-disable */
import supertest from 'supertest'
import app from '../build/app.js'

const api = supertest(app)

const emptyUserList = []
const newUser = {  
  "username": "Vlad Pirogov",
  "age": 44,
  "hobbies" : ["Skiing", "racing"]
}

const updatedUser = {  
  "username": "Sergey Ivanov",
  "age": 16,
  "hobbies" : []
}

let newUserId = '';

test('GET all users should return 200 and empty array', async () => {
  const res = await api.get('/api/users')
  expect(res.status).toEqual(200)
  expect(res.type).toEqual(expect.stringContaining('application/json'));
  expect(res.body).toEqual(emptyUserList);    
    })
    
test('POST should return 201 and object of newly added user with unique id key (string)', async () => {
  const res = await api.post('/api/users').send(newUser)
  expect(res.status).toEqual(201)
  expect(res.type).toEqual(expect.stringContaining('application/json'));
  expect(res.body).toMatchObject(newUser)        
  expect(res.body.id).toEqual(expect.any(String))

  newUserId = res.body.id
  })

test('GET newly created user should return 200 and object of newly created user', async () => {    
  
  const res = await api.get(`/api/users/${newUserId}`)
  expect(res.status).toEqual(200)
  expect(res.body).toMatchObject(newUser)
})

test('PUT should update user by given id and return updated user object with the same id', async () => {
  const res = await api.put(`/api/users/${newUserId}`).send(updatedUser)
  expect(res.status).toEqual(200)
  expect(res.type).toEqual(expect.stringContaining('application/json'));
  expect(res.body).toMatchObject(updatedUser)        
  expect(res.body.id).toEqual(newUserId)  

  })

  test('DELETE should (SUDDENLY!) delete user by given id and return 204', async () => {
  const res = await api.delete(`/api/users/${newUserId}`)
  expect(res.status).toEqual(204)
  })

  test('GET deleted user should return 404', async () => {
    const res = await api.get(`/api/users/${newUserId}`)
    expect(res.status).toEqual(404)    
  })
  
