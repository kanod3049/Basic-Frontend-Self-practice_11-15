//CRUD on quotes
import { getItems } from "./js/myLib/fetchUils.js"

//GET Quotes
async function loadQuotes() {
  try {
    const quotes = await getItems(`${import.meta.env.VITE_APP_URL}/quotes`)
    console.log(quotes)
    return quotes
  } catch (error) {
    alert(error)
  }
}
export { loadQuotes }
//Create Quote
//Edit Quote
//Delete Quote
 