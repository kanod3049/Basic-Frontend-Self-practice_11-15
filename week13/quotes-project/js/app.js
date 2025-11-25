import { api } from "./api.js"
import { renderQuotes, showLoader, hideLoader } from "./ui.js"
import { initEvents } from "./events.js"

document.addEventListener("DOMContentLoaded", async () => {
  showLoader()

  try {
    const quotes = await api.load()
    renderQuotes(document.getElementById("quoteList"), quotes)
  } catch (err) {
    console.error(err)
    alert("Failed to load quotes")
  }

  hideLoader()
  initEvents()
})
