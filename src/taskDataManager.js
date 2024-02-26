import { Database } from "./database.js";

const database = new Database()


export function validateData(table,id, data){
   
  const getData = database.selectById(table, id)
  if(getData == null)
    return false;

  database.update(table, id,{
        id:getData.id,
        title:data.title ? data.title : getData.title,
        description:data.description ? data.description : getData.description,
        completed_at: getData.completed_at,
        created_at: getData.created_at,
        updated_at: new Date(new Date()-3600*1000*3).toISOString(),
    })
  return true;
}

export function setCompleted(table,id){
   
  const getData = database.selectById(table, id)
  if(getData == null)
    return false;

  if(getData.completed_at != null)
    return false;
  
  database.update(table, id,{
        id:getData.id,
        title:getData.title,
        description:getData.description,
        completed_at: new Date(new Date()-3600*1000*3).toISOString(),
        created_at: getData.created_at,
        updated_at: new Date(new Date()-3600*1000*3).toISOString(),
    })
  return true;
}