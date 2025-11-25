function renderQuotes(container, quotes) {
  container.innerHTML = ""
  quotes.forEach((quote) => {
    const card = createQuoteCard(quote)
    container.appendChild(card)
  })
}

function createQuoteCard(quote) {
  const div = document.createElement("div")
  div.className = "quote-card"
  div.dataset.id = quote.id

  div.innerHTML = `
    <p>${quote.content}</p>
    <p class="author">${quote.author}</p>
    <div class="actions">
        <button class="edit" data-id="${quote.id}">Edit</button>
        <button class="delete" data-id="${quote.id}">Delete</button>
    </div>
  `

  return div
}

// Loader
function showLoader() {
  document.getElementById("loader").style.display = "block"
}
function hideLoader() {
  document.getElementById("loader").style.display = "none"
}

// Toast
function showToast(msg) {
  const t = document.getElementById("toast")
  t.textContent = msg
  t.style.display = "block"
  t.style.opacity = 1

  setTimeout(() => {
    t.style.opacity = 0
    setTimeout(() => (t.style.display = "none"), 300)
  }, 1500)
}

// Confirm dialog
function confirmDelete() {
  return new Promise((resolve) => {
    const box = document.getElementById("confirmBox")
    box.style.display = "block"

    document.getElementById("yesBtn").onclick = () => {
      box.style.display = "none"
      resolve(true)
    }
    document.getElementById("noBtn").onclick = () => {
      box.style.display = "none"
      resolve(false)
    }
  })
}

export { createQuoteCard, renderQuotes, showLoader, hideLoader, showToast, confirmDelete }
