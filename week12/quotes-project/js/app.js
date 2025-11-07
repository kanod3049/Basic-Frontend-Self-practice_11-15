import { loadQuotes } from "../quoteManagement"

document.addEventListener("DOMContentLoaded", async () => {
  const quotes = await loadQuotes()
  console.log(quotes)
})
 