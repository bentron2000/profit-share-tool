interface SettingsListItem {
  id: string
  name: string
  description: string
}

function getList() {
  const data = localStorage.getItem('list')
  if (data) {
    return JSON.parse(data) as SettingsListItem[]
  }
  return []
}

function saveToList(item: SettingsListItem) {
  const currentList = getList()
  const newList = [...currentList, item]
  localStorage.setItem('list', JSON.stringify(newList))
}

function resetList() {}
