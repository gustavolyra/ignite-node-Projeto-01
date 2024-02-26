import {randomUUID} from 'node:crypto'
import {Database} from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
import { validateData, setCompleted } from './taskDataManager.js'

const database = new Database()

export const routes =[
  //GET
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) =>{
      const {search} = req.query
      const users = database.select('tasks', search ? {
        title:search,
        description:search,
      } : null)

      return res.end(JSON.stringify(users))
    }
  },
  //POST
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) =>{
      const {title, description} = req.body
      const task = {
        id:randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(new Date()-3600*1000*3).toISOString(),
        updated_at: new Date(new Date()-3600*1000*3).toISOString(),
      }
      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  //DELETE
  {
    method:'DELETE',
    path:buildRoutePath('/tasks/:id'),
    handler: (req, res)=>{
      const {id} = req.params
      database.delete('tasks', id)
      return res.writeHead(204).end()
    }
  },

  //PUT
  {
    method:'PUT',
    path:buildRoutePath('/tasks/:id'),
    handler: (req, res)=>{
      const {id} = req.params
      const {title, description} = req.body
      if(validateData
      ('tasks', id, {
        title,
        description
      }))
        return res.writeHead(204).end()
      else
        return res.writeHead(404).end("ERROR!!")
    }
  },

  //Patch
  {
    method:'PATCH',
    path:buildRoutePath('/tasks/:id/complete'),
    handler: (req, res)=>{
      console.log("PATCH")
      const {id} = req.params
      console.log("ïd: "+ id)
      if(setCompleted('tasks', id))
        return res.writeHead(204).end()
      else
        return res.writeHead(404).end("ERROR!!")
    }
  }
]