// Lesson 3 - Events Starter
import { addQuote, deleteQuote, updateQuote, getAllQuotes } from './quote.js'
import { saveQuotes, loadQuotes } from './storage.js'
// let quotes = []

// Select DOM elements
// const quoteList =
// const form = ...
// const contentInput =
// const authorInput =
// const idInput =
// const randomBtn =
// const randomDisplay =

const quoteList = document.getElementById("quote-list")
const form = document.getElementById("quoteForm")
const contentInput = document.getElementById("content")
const authorInput = document.getElementById("author")
const idInput = document.getElementById("quoteId")
const randomBtn = document.getElementById("randomBtn")
const randomDisplay = document.getElementById("randomQuoteDisplay")

function createQuoteElement(quote) {
  // a quote element example
  //<section id="quote-list">
  //  <div data-id="1">
  //    <p>Confidence comes from discipline and training</p>
  //    <p>Robert</p>
  //    <button class="edit-btn" data-id="1">
  //      Edit
  //    </button>
  //    <button class="delete-btn" data-id="1">
  //      Delete
  //    </button>
  //  </div>
  // </section>
  const div = document.createElement("div")
  div.dataset.id = quote.id

  const quoteP = document.createElement("p")
  quoteP.textContent = `${quote.content}`

  const authorP = document.createElement("p")
  authorP.textContent = `${quote.author}`

  const editBtn = document.createElement("button")
  editBtn.textContent = "Edit"
  editBtn.dataset.id = quote.id
  editBtn.classList.add("edit-btn")

  const deleteBtn = document.createElement("button")
  deleteBtn.textContent = "Delete"
  deleteBtn.dataset.id = quote.id
  deleteBtn.classList.add("delete-btn")

  editBtn.addEventListener("click", () => {
    const q = getAllQuotes().find(q => q.id === quote.id)
    if (q) {
      idInput.value = q.id
      contentInput.value = q.content
      authorInput.value = q.author
    }
  })

  deleteBtn.addEventListener("click", () => {
    deleteQuote(quote.id)
    deleteQuoteFromDOM(quote.id)
  })

  div.append(quoteP, authorP, editBtn, deleteBtn)
  return div
}

// Add, edit, delete quote functions

function addQuoteToDOM(quote) {
  const ele = createQuoteElement(quote)
  quoteList.appendChild(ele)
}
function updateQuoteInDOM(quote) {
  const ele = document.querySelector(`[data-id='${quote.id}']`)
  if (ele) {
    ele.querySelector("p:first-child").textContent = `${quote.content}`
    ele.querySelector("p:nth-child(2)").textContent = `${quote.author}`
  }
}
function deleteQuoteFromDOM(id) {
  const ele = document.querySelector(`[data-id='${id}']`)
  if (ele) ele.remove()
}
function renderQuotes() {
  quoteList.innerHTML = ""
  getAllQuotes().forEach(addQuoteToDOM)
}
function showRandomQuote() {
  const quote = getAllQuotes()
  if (quote.length === 0) {
    randomDisplay.textContent = "-- No quotes to show --"
    return
  }
  const random = quote[Math.floor(Math.random() * quote.length)]
  randomDisplay.textContent = `${random.content} - ${random.author}`
}
// Event listeners for form submission, edit, and delete clicks

form.addEventListener("submit", (e) => {
  e.preventDefault()
  const content = contentInput.value.trim()
  const author = authorInput.value.trim()
  const id = idInput.value

  if (!content || !author) {
    
    return
  }

  if (id) {
    const edit = updateQuote(Number(id), content, author)
    updateQuoteInDOM(edit)
    saveQuotes()
    updateCounter()
    showMessage("Quote updated successfully!")
  } else {
    const add = addQuote(content, author)
    addQuoteToDOM(add)
    saveQuotes()
    updateCounter()
    showMessage("Quote added successfully!")
  }

  form.reset()
  idInput.value = ""
})


randomBtn.addEventListener("click", showRandomQuote)

const counter = document.createElement("p")
document.body.insertBefore(counter, quoteList)

function updateCounter() {
  const total = getAllQuotes().length
  counter.textContent = `You have ${total} quote${total > 1 ? "s" : ""}.`
}

quoteList.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id)
  if (e.target.classList.contains("delete-btn")) {
    deleteQuote(id)
    deleteQuoteFromDOM(id)
    saveQuotes()
    updateCounter()
  }
  if (e.target.classList.contains("edit-btn")) {
    const q = getAllQuotes().find(q => q.id === id)
    idInput.value = q.id
    contentInput.value = q.content
    authorInput.value = q.author
  }
})

const messageBox = document.createElement("p")
messageBox.style.color = "green"
document.body.appendChild(messageBox)

function showMessage(msg) {
  messageBox.textContent = msg
  setTimeout(() => messageBox.textContent = "", 1500)
}

loadQuotes()
renderQuotes()
updateCounter()

