import { getItems, addItem, editItem, deleteItem } from "./myLib/fetchUtils.js"

const quoteURL = `${import.meta.env.VITE_APP_URL}/quotes`

export const api = {
  load: () => getItems(quoteURL),
  add: (data) => addItem(quoteURL, data),
  edit: (data) => editItem(quoteURL, data),
  delete: (id) => deleteItem(quoteURL, id)
}
