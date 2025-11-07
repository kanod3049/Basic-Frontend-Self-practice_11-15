//CRUD on any items
//GET
async function getItems(url) {
  try {
    const res = await fetch(url) //fetch returns respnse object
    console.log(res)
    const data = await res.json() //json() converts json string to JavaScript object
    console.log(data)
    return data
  } catch (error) {
    throw new Error(error)
  }
}
export { getItems }
//POST
//PUT
//DELETE
 