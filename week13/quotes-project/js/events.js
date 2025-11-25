import { api } from "./api.js"
import { createQuoteCard, showToast, confirmDelete } from "./ui.js"

function initEvents() {
  initSearch()
  initSort()
  initForm()
  initDelete()
}

function initSearch() {
  const input = document.getElementById("searchInput")
  input.addEventListener("input", (e) => {
    const text = e.target.value.toLowerCase()

    document.querySelectorAll(".quote-card").forEach(card => {
      const content = card.children[0].textContent.toLowerCase()
      const author = card.children[1].textContent.toLowerCase()

      card.style.display =
        content.includes(text) || author.includes(text)
          ? "block"
          : "none"
    })
  })
}

function initSort() {
  document.getElementById("sortAuthor").addEventListener("click", () => {
    const cards = [...document.querySelectorAll(".quote-card")]

    cards.sort((a, b) =>
      a.children[1].textContent.localeCompare(b.children[1].textContent)
    )

    const list = document.getElementById("quoteList")
    list.innerHTML = ""
    cards.forEach(c => list.appendChild(c))
  })
}

function initForm() {
  const form = document.getElementById("quoteForm")

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const id = form.quoteId.value
    const content = form.content.value
    const author = form.author.value

    if (id) {
      const updated = await api.edit({ id, content, author })
      const card = document.querySelector(`div[data-id="${id}"]`)
      card.children[0].textContent = updated.content
      card.children[1].textContent = updated.author
      showToast("Updated!")
    } else {
      const newQuote = await api.add({ content, author })
      const list = document.getElementById("quoteList")
      const newCard = createQuoteCard(newQuote)
      list.appendChild(newCard)
      showToast("Added!")
    }

    form.reset()
    form.quoteId.value = ""
  })
}

function initDelete() {
  document.getElementById("quoteList").addEventListener("click", async (e) => {
    if (!e.target.classList.contains("delete")) return

    const id = e.target.dataset.id
    const ok = await confirmDelete()
    if (!ok) return

    await api.delete(id)
    document.querySelector(`div[data-id="${id}"]`).remove()
    showToast("Deleted!")
  })
}

export { initEvents }
