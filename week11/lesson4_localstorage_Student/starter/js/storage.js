import { getAllQuotes, addQuote } from './quote.js'

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(getAllQuotes()))
}

function loadQuotes() {
  const saved = localStorage.getItem('quotes')
  if (saved) {
    JSON.parse(saved).forEach(q => addQuote(q.content, q.author))
  }
}

export { saveQuotes, loadQuotes }