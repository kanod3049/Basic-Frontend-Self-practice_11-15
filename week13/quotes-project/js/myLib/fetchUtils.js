async function request(url, options = {}) {
  try {
    const res = await fetch(url, options)

    if (!res.ok) {
      const msg = `${res.status} - ${res.statusText}`
      throw new Error(msg)
    }

    // DELETE ไม่มี body
    if (res.status === 204) return null

    return await res.json()
  } catch (err) {
    throw new Error(err.message)
  }
}

export function getItems(url) {
  return request(url)
}

export function addItem(url, item) {
  return request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item)
  })
}

export function editItem(url, item) {
  return request(`${url}/${item.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item)
  })
}

export function deleteItem(url, id) {
  return request(`${url}/${id}`, { method: "DELETE" })
}
